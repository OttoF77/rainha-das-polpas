/**
 * Retorna o caminho absoluto do asset considerando o subpath de deploy (NEXT_PUBLIC_BASE_PATH).
 * Exemplo: getAssetPath('/images/products/abacaxi_done.png') -> '/rainhadaspolpas/images/products/abacaxi_done.png'
 */
export function getAssetPath(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (!basePath) {
    return normalizedPath;
  }
  const cleanBasePath = basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
  return `${cleanBasePath}${normalizedPath}`;
}
