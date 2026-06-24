# Deployment Guide

This document describes how to deploy the Aether Stocks tracker on Render.

## Deploying on Render
1. Create a new Web Service on Render.
2. Link your Git repository.
3. Configure the build parameters:
   - **Environment**: Docker
   - **Branch**: main
4. Render will automatically detect the `Dockerfile` and build the multi-stage image.
5. The container will start, exposing Nginx on port 80.

## Troubleshooting
- **Routing Issues (404 on subpages)**: Solved by `nginx.conf` rewriting requests using `try_files $uri $uri/ /index.html;`.
- **Docker Build Cache Failures**: Ensure `package.json` and `package-lock.json` are copied and installed first in the build phase.
