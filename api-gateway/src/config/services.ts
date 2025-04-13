import { Application } from "express";
import { config } from ".";
import { ProxyErrorResponse, ServiceConfig } from "../types";
import logger from "./logger";
import { createProxyMiddleware, Options } from "http-proxy-middleware";

class ServiceProxy {
  private static readonly serviceConfigs: ServiceConfig[] = [
    {
      path: "/api/v1/auth/",
      url: config.AUTH_SERVICE_URL,
      pathRewrite: { "^/": "/api/v1/auth/" },
      name: "auth-service",
      timeout: 5000,
    },
    {
      path: "/api/v1/accounts/",
      url: config.ACCOUNTS_SERVICE_URL,
      pathRewrite: { "^/": "/api/v1/accounts/" },
      name: "accounts-service",
    },
    {
      path: "/api/v1/transactions/",
      url: config.TRANSACTION_SERVICE_URL,
      pathRewrite: { "^/": "/api/v1/transactions/" },
      name: "transactions-service",
    },
  ];

  private static createproxyOptions(service: ServiceConfig): Options {
    return {
      target: service.url,
      changeOrigin: true,
      pathRewrite: service.pathRewrite,
      timeout: service.timeout || config.DEFAULT_TIMEOUT,
      logger: logger,
      on: {
        error: ServiceProxy.handleProxyError,
        proxyReq: ServiceProxy.handleProxyRequest,
        proxyRes: ServiceProxy.handleProxyResponse,
      },
    };
  }

  private static handleProxyError(err: Error, req: any, res: any): void {
    logger.error(`Proxy error for ${req.path}:`, err);

    const errorResponse: ProxyErrorResponse = {
      message: `Service unavailable`,
      status: 503,
      timestamp: new Date().toISOString(),
    };

    res
      .status(503)
      .setHeader("Content-Type", "application/json")
      .end(JSON.stringify(errorResponse));
  }

  private static handleProxyRequest(proxyReq: any, res: any): void {}

  private static handleProxyResponse(proxyRes: any, req: any): void {}

  public static setupProxy(app: Application): void {
    ServiceProxy.serviceConfigs.forEach((service) => {
      const proxyOptions = ServiceProxy.createproxyOptions(service);
      app.use(service.path, createProxyMiddleware(proxyOptions));
      logger.info(`Configured proxy for ${service.name} at ${service.path}`);
    });
  }
}

export const proxyServices = (app: Application): void => {
  ServiceProxy.setupProxy(app);
};
