FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5000

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["EmotionChat.API.csproj", "./"]
RUN dotnet restore "EmotionChat.API.csproj"
COPY . .
WORKDIR "/src"
RUN dotnet build "EmotionChat.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "EmotionChat.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "EmotionChat.API.dll"]


