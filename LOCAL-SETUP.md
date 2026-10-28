# FarmConnect — Run Locally

I've pre-configured this copy for local run.

## What I changed for you
- Frontend API URLs in `angularapp/src/app/services/*.ts` now point to `http://localhost:8080` (was the examly.io URL)
- Backend `dotnetapp/Program.cs` now falls back to an in-memory database if `Connection_String` is not set, so you can run without SQL Server for a quick test

## Backend (ASP.NET Core)
1. Install .NET 6 SDK from https://dotnet.microsoft.com/download
2. In a terminal:
   ```
   cd dotnetapp
   dotnet restore
   dotnet run
   ```
   - With no `.env`, it uses in-memory DB (quick test, data resets on restart)
   - With SQL Server: copy `.env.example` to `.env`, fill in your connection string, then `dotnet ef database update` before `dotnet run`
3. API will be at `http://localhost:8080`, Swagger at `http://localhost:8080/swagger`

## Frontend (Angular)
1. Install Node 18+ and Angular CLI: `npm install -g @angular/cli`
2. In a new terminal:
   ```
   cd angularapp
   npm install
   npm start
   ```
3. Open `http://localhost:8081`

Run the backend first, then the frontend.
