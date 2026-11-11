import { NextRequest, NextResponse } from "next/server";

const API_KEY_HEADER = "x-api-key";
const DEFAULT_BACKEND_URL = "http://localhost:3001";

interface RouteContext {
  params: Promise<{ path: string[] }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

async function proxyRequest(request: NextRequest, context: RouteContext) {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { message: "API_KEY is not configured on the frontend server." },
      { status: 500 },
    );
  }

  const { path } = await context.params;
  const backendBaseUrl = process.env.BACKEND_URL ?? DEFAULT_BACKEND_URL;
  const targetUrl = new URL(`/api/${path.join("/")}`, backendBaseUrl);
  targetUrl.search = request.nextUrl.search;

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers.set("content-type", contentType);
  }
  headers.set(API_KEY_HEADER, apiKey);

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const upstream = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: hasBody ? await request.arrayBuffer() : undefined,
    cache: "no-store",
  });

  const responseHeaders = new Headers();
  const upstreamContentType = upstream.headers.get("content-type");
  if (upstreamContentType) {
    responseHeaders.set("content-type", upstreamContentType);
  }
  const cacheControl = upstream.headers.get("cache-control");
  if (cacheControl) {
    responseHeaders.set("cache-control", cacheControl);
  }

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}
