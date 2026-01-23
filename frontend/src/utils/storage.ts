// Local storage utilities for address book and wallet data
export const storage = {
  // Address Book
  getAddressBook: (): Record<string, string> => {
    if (typeof window === 'undefined') return {}
    const stored = localStorage.getItem('addressBook')
    return stored ? JSON.parse(stored) : {}
  },

  saveContact: (name: string, address: string) => {
    const book = storage.getAddressBook()
    book[name] = address
    localStorage.setItem('addressBook', JSON.stringify(book))
  },

  deleteContact: (name: string) => {
    const book = storage.getAddressBook()
    delete book[name]
    localStorage.setItem('addressBook', JSON.stringify(book))
  },

  // Session Wallet (temporary, not persisted)
  setSessionWallet: (publicKey: string, privateKey: string) => {
    if (typeof window === 'undefined') return
    sessionStorage.setItem('wallet_pub', publicKey)
    sessionStorage.setItem('wallet_priv', privateKey)
  },

  getSessionWallet: () => {
    if (typeof window === 'undefined') return null
    const pub = sessionStorage.getItem('wallet_pub')
    const priv = sessionStorage.getItem('wallet_priv')
    return pub && priv ? { publicKey: pub, privateKey: priv } : null
  },

  clearSessionWallet: () => {
    if (typeof window === 'undefined') return
    sessionStorage.removeItem('wallet_pub')
    sessionStorage.removeItem('wallet_priv')
  },
}
