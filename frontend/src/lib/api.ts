import axios, { AxiosInstance } from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// API Endpoints
export const apiEndpoints = {
  // Wallet endpoints
  createWallet: () => '/createWallet',
  getBalance: (address: string) => `/balance/${address}`,
  
  // Transaction endpoints
  sendTransaction: () => '/transaction',
  getTransactions: (address: string) => `/transactions/${address}`,
  
  // Block endpoints
  getBlocks: () => '/blocks',
  getBlock: (index: number | string) => `/block/${index}`,
  
  // Mining endpoints
  mine: (address: string) => `/mine/${address}`,
}

// Wallet API
export const walletAPI = {
  createWallet: async () => {
    try {
      const response = await api.post(apiEndpoints.createWallet())
      return response.data
    } catch (error) {
      console.error('Error creating wallet:', error)
      throw error
    }
  },

  getBalance: async (address: string) => {
    try {
      const response = await api.get(apiEndpoints.getBalance(address))
      return response.data
    } catch (error) {
      console.error('Error fetching balance:', error)
      throw error
    }
  },
}

// Transaction API
export const transactionAPI = {
  sendTransaction: async (payload: any) => {
    try {
      const response = await api.post(apiEndpoints.sendTransaction(), payload)
      return response.data
    } catch (error) {
      console.error('Error sending transaction:', error)
      throw error
    }
  },

  getTransactions: async (address: string) => {
    try {
      const response = await api.get(apiEndpoints.getTransactions(address))
      return response.data
    } catch (error) {
      console.error('Error fetching transactions:', error)
      throw error
    }
  },
}

// Block API
export const blockAPI = {
  getBlocks: async () => {
    try {
      const response = await api.get(apiEndpoints.getBlocks())
      return response.data
    } catch (error) {
      console.error('Error fetching blocks:', error)
      throw error
    }
  },

  getBlock: async (index: number | string) => {
    try {
      const response = await api.get(apiEndpoints.getBlock(index))
      return response.data
    } catch (error) {
      console.error('Error fetching block:', error)
      throw error
    }
  },
}

// Mining API
export const miningAPI = {
  mine: async (address: string) => {
    try {
      const response = await api.post(apiEndpoints.mine(address))
      return response.data
    } catch (error) {
      console.error('Error mining:', error)
      throw error
    }
  },
}

export default api
