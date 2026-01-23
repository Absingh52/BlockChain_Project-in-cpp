const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// Utility function for better error handling
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `Server error: ${response.status} ${response.statusText}. ${errorText || 'No error details'}`
    )
  }
  return response.json()
}

export const api = {
  createWallet: async () => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

      try {
        const res = await fetch(`${API_BASE}/api/createWallet`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
        })

        clearTimeout(timeoutId)
        const data = await handleResponse(res)

        if (!data || typeof data !== 'object') {
          throw new Error('Invalid response format from server')
        }

        if (!data.success && data.error) {
          throw new Error(data.error)
        }

        if (!data.publicKey || !data.privateKey) {
          throw new Error('Invalid wallet data received')
        }

        return data
      } catch (error: any) {
        clearTimeout(timeoutId)
        if (error.name === 'AbortError') {
          throw new Error(
            'Request timeout. Backend server may not be responding. Check if the server is running on port 5000.'
          )
        }
        throw error
      }
    } catch (error: any) {
      console.error('Wallet creation error:', error)
      const message =
        error?.message ||
        'Failed to create wallet. Ensure backend is running at http://localhost:5000'
      throw new Error(message)
    }
  },

  sendTransaction: async (transaction: any) => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      try {
        const res = await fetch(`${API_BASE}/api/transaction`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transaction),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)
        return await handleResponse(res)
      } catch (error: any) {
        clearTimeout(timeoutId)
        if (error.name === 'AbortError') {
          throw new Error('Request timeout - server not responding')
        }
        throw error
      }
    } catch (error: any) {
      console.error('Transaction error:', error)
      throw error
    }
  },

  mineBlock: async (minerPublicKey: string) => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60s for mining

      try {
        const res = await fetch(`${API_BASE}/api/mine`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ minerPublicKey }),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)
        return await handleResponse(res)
      } catch (error: any) {
        clearTimeout(timeoutId)
        if (error.name === 'AbortError') {
          throw new Error('Mining timeout - operation took too long')
        }
        throw error
      }
    } catch (error: any) {
      console.error('Mining error:', error)
      throw error
    }
  },

  getBlocks: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/blocks`, { cache: 'no-store' })
      return await handleResponse(res)
    } catch (error: any) {
      console.error('Get blocks error:', error)
      throw new Error('Failed to fetch blocks. Server may be unavailable.')
    }
  },

  getBlock: async (index: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/block/${index}`, { cache: 'no-store' })
      return await handleResponse(res)
    } catch (error: any) {
      console.error('Get block error:', error)
      throw error
    }
  },

  getBalance: async (address: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/balance/${address}`, { cache: 'no-store' })
      return await handleResponse(res)
    } catch (error: any) {
      console.error('Get balance error:', error)
      throw error
    }
  },
}

// Client-side transaction signing simulation
// In production, this would use actual cryptography libraries
export const crypto = {
  signTransaction: async (message: string, privateKey: string): Promise<string> => {
    // For demo purposes, create a deterministic signature based on the message and key
    // This is NOT secure and only for educational purposes
    const combined = message + privateKey
    let hash = 0
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return Math.abs(hash).toString(16).padStart(64, '0')
  },

  calculateHash: (data: string): string => {
    // Simple hash for demo
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return Math.abs(hash).toString(16).padStart(64, '0')
  },
}
