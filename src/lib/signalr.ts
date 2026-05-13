/// <reference types="vite/client" />

import * as signalR from '@microsoft/signalr'

let connection: signalR.HubConnection | null = null

/**
 * Retourne (ou crée) la connexion SignalR singleton.
 * Le token JWT est lu depuis localStorage au moment de l'appel.
 */
export function getHubConnection(): signalR.HubConnection {
  if (connection) return connection

  // En dev : utilise le proxy Vite (/chatHub sera proxifié)
  // En prod : construit l'URL wss:// complète
  const apiBase = import.meta.env.VITE_API_BASE_URL as string | undefined
  const hubUrl = import.meta.env.PROD && apiBase
    ? `${apiBase}/chatHub`.replace(/^http/, 'ws')
    : '/chatHub'

  connection = new signalR.HubConnectionBuilder()
    .withUrl(hubUrl, {
      accessTokenFactory: () => localStorage.getItem('thiskord_token') ?? '',
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Warning)
    .build()
  return connection
}

/**
 * Démarre la connexion si elle n'est pas déjà active.
 */
export async function startConnection(): Promise<void> {
  const conn = getHubConnection()
  if (conn.state === signalR.HubConnectionState.Disconnected) {
    await conn.start()
    console.info('SignalR connected');
  }
}

/**
 * Stoppe et détruit la connexion (à appeler au logout).
 */
export async function stopConnection(): Promise<void> {
  if (connection) {
    await connection.stop()
    connection = null
  }
}