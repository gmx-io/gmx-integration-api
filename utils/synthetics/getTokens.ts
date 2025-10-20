import { fetchUrl } from '@/lib/fetchUrl'
import { ORACLE_KEEPER_URLS, Token } from '@/config/synthetics'

export async function getTokens(chainId: number): Promise<Token[]> {
    const baseUrl = ORACLE_KEEPER_URLS[chainId];
    const tokenUrl = `${baseUrl}/tokens` 
    const tokenInfoData = await fetchUrl(tokenUrl);
    const tokenInfo: Token[] = tokenInfoData.tokens;
    
    return tokenInfo
}
