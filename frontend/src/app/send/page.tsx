'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Card } from '@/components/Card'
import { api, crypto } from '@/utils/api'
import { storage } from '@/utils/storage'
import { motion } from 'framer-motion'
import {
  HiOutlineCheckCircle,
  HiOutlineArrowRight,
  HiOutlineXMark,
  HiOutlinePlus,
  HiOutlineTrash,
} from 'react-icons/hi2'

export default function SendPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [sender, setSender] = useState('')
  const [senderPrivateKey, setSenderPrivateKey] = useState('')
  const [receiver, setReceiver] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] =
    useState<'success' | 'error' | 'info'>('info')

  const [addressBook, setAddressBook] = useState<Record<string, string>>({})
  const [contacts, setContacts] = useState<string[]>([])
  const [showAddContact, setShowAddContact] = useState(false)
  const [newContactName, setNewContactName] = useState('')
  const [newContactAddress, setNewContactAddress] = useState('')

  useEffect(() => {
    const wallet = storage.getSessionWallet()
    if (wallet) {
      setSender(wallet.publicKey)
      setSenderPrivateKey(wallet.privateKey)
    }

    const book = storage.getAddressBook()
    setAddressBook(book)
    setContacts(Object.keys(book))
  }, [])

  const handleAddContact = () => {
    if (!newContactName || !newContactAddress) {
      setMessage('Name and address required')
      setMessageType('error')
      return
    }

    storage.saveContact(newContactName, newContactAddress)
    setAddressBook(prev => ({ ...prev, [newContactName]: newContactAddress }))
    setContacts(prev => [...prev, newContactName])

    setNewContactName('')
    setNewContactAddress('')
    setShowAddContact(false)

    setMessage('Contact added')
    setMessageType('success')
    setTimeout(() => setMessage(''), 2500)
  }

  const handleDeleteContact = (name: string) => {
    storage.deleteContact(name)
    setAddressBook(prev => {
      const copy = { ...prev }
      delete copy[name]
      return copy
    })
    setContacts(prev => prev.filter(c => c !== name))
  }

  const handleSendTransaction = async () => {
    if (!sender || !senderPrivateKey || !receiver || !amount) {
      setMessage('All fields required')
      setMessageType('error')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const timestamp = Math.floor(Date.now() / 1000)
      const raw = `${sender}${receiver}${amount}${timestamp}`
      const txHash = crypto.calculateHash(raw)
      const signature = await crypto.signTransaction(raw, senderPrivateKey)

      const res = await api.sendTransaction({
        senderPublicKey: sender,
        receiverPublicKey: receiver,
        amount: Number(amount),
        timestamp,
        transactionHash: txHash,
        signatureHex: signature,
      })

      if (!res.success) throw new Error(res.error)

      setMessage('Transaction sent successfully')
      setMessageType('success')
      setReceiver('')
      setAmount('')
      setStep(1)
    } catch (e: any) {
      setMessage(e.message || 'Transaction failed')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 bg-slate-50 dark:bg-slate-900"
      >
        <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* FORM */}
          <div className="lg:col-span-2">
            <Card title="Send Transaction">
              <div className="space-y-4">
                <input
                  disabled
                  value={sender}
                  className="w-full p-3 rounded bg-slate-100 dark:bg-slate-700 font-mono text-xs"
                />

                <input
                  value={receiver}
                  onChange={e => setReceiver(e.target.value)}
                  placeholder="Receiver address"
                  className="w-full p-3 rounded border dark:bg-slate-700"
                />

                <input
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="Amount"
                  type="number"
                  className="w-full p-3 rounded border dark:bg-slate-700"
                />

                <motion.button
                  onClick={handleSendTransaction}
                  disabled={loading}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-green-600 text-white py-3 rounded font-semibold"
                >
                  {loading ? 'Sending...' : 'Send Transaction'}
                </motion.button>

                {message && (
                  <div
                    className={`text-sm font-mono p-3 rounded border ${
                      messageType === 'success'
                        ? 'bg-green-50 border-green-300'
                        : 'bg-red-50 border-red-300'
                    }`}
                  >
                    {message}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* ADDRESS BOOK */}
          <div>
            <Card title="Address Book">
              <div className="space-y-3">
                {contacts.map(name => (
                  <div
                    key={name}
                    className="flex justify-between items-center bg-slate-100 dark:bg-slate-700 p-2 rounded"
                  >
                    <div>
                      <p className="font-semibold">{name}</p>
                      <p className="text-xs font-mono">
                        {addressBook[name].slice(0, 16)}...
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteContact(name)}
                      className="text-red-500"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {!showAddContact ? (
                  <button
                    onClick={() => setShowAddContact(true)}
                    className="w-full bg-blue-600 text-white py-2 rounded text-sm"
                  >
                    <HiOutlinePlus className="inline w-4 h-4 mr-1" />
                    Add Contact
                  </button>
                ) : (
                  <div className="space-y-2">
                    <input
                      placeholder="Name"
                      value={newContactName}
                      onChange={e => setNewContactName(e.target.value)}
                      className="w-full p-2 rounded border"
                    />
                    <input
                      placeholder="Address"
                      value={newContactAddress}
                      onChange={e => setNewContactAddress(e.target.value)}
                      className="w-full p-2 rounded border font-mono text-xs"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddContact}
                        className="flex-1 bg-green-600 text-white py-1 rounded text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setShowAddContact(false)}
                        className="flex-1 bg-slate-400 text-white py-1 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </motion.main>
    </div>
  )
}
