import path from 'node:path';
import fs from 'node:fs/promises';

class Router {
   constructor() {
      this.routesCache = new Map();
      this.enableHotReload = process.env.NODE_ENV !== 'production';
   }

   async handleRoute(req, res) {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const pathname = url.pathname;
      const method = req.method.toUpperCase();

      req.body = await this.parseBody(req);
      req.params = {};
      req.query = Object.fromEntries(url.searchParams);

      try {
         const routeHandler = await this.findRoute(pathname, method);

         if (!routeHandler) {
            return this.sendResponse(res, 404, { error: 'Not Found' });
         }

         const { handler, params } = routeHandler;
         req.params = params;

         const result = await handler(req, res);

         if (!res.headersSent && result !== undefined) {
            this.sendResponse(res, res.statusCode || 200, result);
         }
      } catch (error) {
         console.error('Route error:', error);
         if (res.headersSent) {
            return;
         }

         if (error.status) {
            this.sendResponse(res, error.status, { error: error.message });
         } else {
            this.sendResponse(res, 500, { error: 'Internal Server Error' });
         }
      }
   }

   async parseBody(req) {
      return new Promise((resolve) => {
         let body = '';

         req.on('data', (chunk) => {
            body += chunk.toString();
         });
         req.on('end', () => {
            try {
               resolve(body ? JSON.parse(body) : {});
            } catch {
               resolve({});
            }
         });
      });
   }

   sendResponse(res, status, data) {
      res.statusCode = status;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      if (res.method === 'OPTIONS') {
         res.end();
         return;
      }

      res.end(JSON.stringify(data, null, 2));
   }

   async findRoute(pathname, method) {
      const segments = pathname.split('/').filter(Boolean);
      const routesFolderName = 'routes';
      const routesDir = path.join(process.cwd(), routesFolderName);

      return await this.matchRoute(routesDir, segments, method, {});
   }

   async matchRoute(currentDir, segments, method, params) {
      // handle route file
      if (segments.length === 0) {
         const routeFile = path.join(currentDir, 'route.js');

         try {
            await fs.access(routeFile);
            const routeModule = await this.loadRoute(routeFile);
            if (routeModule[method]) {
               return { handler: routeModule[method], params };
            } else {
               const error = new Error('Method Not Allowed');
               error.status = 405;
               throw error;
            }
         } catch (error) {
            if (error.status === 405) {
               throw error;
            }

            return null;
         }
      }

      // handle nested route file
      const [currentSegment, ...restSegments] = segments;

      try {
         const entries = await fs.readdir(currentDir, { withFileTypes: true });

         // First, try exact match
         for (const entry of entries) {
            if (entry.isDirectory() && entry.name === currentSegment) {
               const result = await this.matchRoute(
                  path.join(currentDir, entry.name),
                  restSegments,
                  method,
                  params,
               );
               if (result) return result;
            }
         }

         // Then, try dynamic routes [param]
         for (const entry of entries) {
            if (entry.isDirectory() && entry.name.startsWith('[') && entry.name.endsWith(']')) {
               const paramName = entry.name.slice(1, -1);
               const newParams = { ...params, [paramName]: currentSegment };
               const result = await this.matchRoute(
                  path.join(currentDir, entry.name),
                  restSegments,
                  method,
                  newParams,
               );

               if (result) {
                  return result;
               }
            }
         }
      } catch {
         console.error('Error reading directory:', currentDir);
      }

      return null;
   }

   async loadRoute(routeFile) {
      if (this.enableHotReload) {
         const timestamp = Date.now();
         const moduleUrl = `file://${routeFile}?t=${timestamp}`;
         return await import(moduleUrl);
      } else {
         const moduleUrl = `file://${routeFile}`;
         return await import(moduleUrl);
      }
   }
}

export const router = new Router();
