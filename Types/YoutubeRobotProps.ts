import { GoogleApis } from 'googleapis/build/src/index'

export type TokensProps = {
    access_token: string
    refresh_token: string
    scope: string
    token_type: string
    expiry_date: number
}

export type OAuthClientProps = {
    getToken: (authorizationToken: any, CallbackOAuth: CallbackOAuthProps) => void
    setCredentials: (tokens: TokensProps) => void
    generateAuthUrl: (generateAuthUrlProps: generateAuthUrlProps) => string
}

type generateAuthUrlProps = {
    access_type: string
    scope: string[]
}

type CallbackOAuthProps = (error: any, tokens: TokensProps) => void
export type OAuthClient = GoogleApis['auth']