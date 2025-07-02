'use client'

import { Shirt, Award, ShoppingCart } from 'lucide-react'
import { AvatarConfiguration } from '@/lib/avatarApi'

interface ClothingCustomizationProps {
  configuration: AvatarConfiguration
  onConfigurationUpdate: (config: Partial<AvatarConfiguration>) => void
  userCurrency: { coins: number; tokens: number }
  onPurchaseItem?: (item: { id: string; name: string; cost: { coins?: number; tokens?: number } }) => void
}

const BUSINESS_SUITS = [
  { id: 'navy-executive', name: 'Navy Executive', category: 'Executive', rarity: 'legendary', cost: { tokens: 200 }, owned: true },
  { id: 'charcoal-professional', name: 'Charcoal Professional', category: 'Professional', rarity: 'epic', cost: { tokens: 75 }, owned: true },
  { id: 'black-formal', name: 'Black Formal', category: 'Formal', rarity: 'rare', cost: { coins: 500 }, owned: false },
  { id: 'gray-business', name: 'Gray Business', category: 'Business', rarity: 'uncommon', cost: { coins: 300 }, owned: true },
  { id: 'pinstripe-executive', name: 'Pinstripe Executive', category: 'Executive', rarity: 'legendary', cost: { tokens: 300 }, owned: false },
  { id: 'modern-slim', name: 'Modern Slim Fit', category: 'Contemporary', rarity: 'rare', cost: { tokens: 50 }, owned: false }
]

const DRESS_SHIRTS = [
  { id: 'white-premium', name: 'Premium White', rarity: 'common', owned: true },
  { id: 'light-blue', name: 'Light Blue', rarity: 'common', owned: true },
  { id: 'powder-blue', name: 'Powder Blue', rarity: 'uncommon', owned: false },
  { id: 'lavender', name: 'Lavender', rarity: 'rare', owned: false }
]

const TIES_AND_ACCESSORIES = [
  { id: 'silk-red', name: 'Silk Red Tie', category: 'tie', rarity: 'uncommon', owned: true },
  { id: 'navy-striped', name: 'Navy Striped', category: 'tie', rarity: 'common', owned: true },
  { id: 'executive-gold', name: 'Executive Gold', category: 'tie', rarity: 'epic', owned: false },
  { id: 'watch-luxury', name: 'Luxury Watch', category: 'accessory', rarity: 'legendary', owned: false },
  { id: 'cufflinks-gold', name: 'Gold Cufflinks', category: 'accessory', rarity: 'rare', owned: true },
  { id: 'pocket-square', name: 'Pocket Square', category: 'accessory', rarity: 'uncommon', owned: false }
]

export default function ClothingCustomization({ 
  configuration, 
  onConfigurationUpdate, 
  userCurrency,
  onPurchaseItem 
}: ClothingCustomizationProps) {
  const updateClothing = (clothingUpdate: Partial<AvatarConfiguration['clothing']>) => {
    onConfigurationUpdate({
      clothing: { ...configuration.clothing, ...clothingUpdate }
    })
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'border-yellow-500 bg-yellow-500/10'
      case 'epic': return 'border-purple-500 bg-purple-500/10'
      case 'rare': return 'border-blue-500 bg-blue-500/10'
      case 'uncommon': return 'border-green-500 bg-green-500/10'
      default: return 'border-slate-600 bg-slate-800/50'
    }
  }

  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-yellow-500 text-yellow-900'
      case 'epic': return 'bg-purple-500 text-white'
      case 'rare': return 'bg-blue-500 text-white'
      case 'uncommon': return 'bg-green-500 text-white'
      default: return 'bg-slate-500 text-white'
    }
  }

  const canAfford = (cost: { coins?: number; tokens?: number }) => {
    if (!cost) return true
    if (cost.coins && userCurrency.coins < cost.coins) return false
    if (cost.tokens && userCurrency.tokens < cost.tokens) return false
    return true
  }

  const formatCost = (cost: { coins?: number; tokens?: number }) => {
    if (!cost) return 'Free'
    if (cost.tokens) return `${cost.tokens} 🔹`
    if (cost.coins) return `${cost.coins} 🪙`
    return 'Free'
  }

  return (
    <div className="space-y-8">
      <div className="text-center border-b border-slate-700/50 pb-6">
        <h3 className="text-xl font-bold text-white mb-2">Professional Attire</h3>
        <p className="text-slate-400">Banking industry appropriate clothing</p>
      </div>

      {/* Business Suits */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Business Suits</h4>
        <div className="grid grid-cols-2 gap-4">
          {BUSINESS_SUITS.map((suit) => (
            <div
              key={suit.id}
              className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                configuration.clothing.suit === suit.id
                  ? `${getRarityColor(suit.rarity)} shadow-lg scale-105`
                  : `${getRarityColor(suit.rarity)} hover:scale-102 opacity-80 hover:opacity-100`
              } ${!suit.owned ? 'cursor-pointer' : ''}`}
              onClick={() => suit.owned && updateClothing({ suit: suit.id })}
            >
              <div className="text-center">
                <div className="mb-3">
                  <Shirt className="w-8 h-8 text-blue-400 mx-auto" />
                </div>
                <div className="text-sm font-medium text-white mb-1">{suit.name}</div>
                <div className="text-xs text-slate-400 mb-2">{suit.category}</div>
                
                {/* Rarity Badge */}
                <div className="flex items-center justify-center mb-3">
                  <span className={`px-2 py-1 text-xs rounded-full font-semibold ${getRarityBadgeColor(suit.rarity)}`}>
                    {suit.rarity.toUpperCase()}
                  </span>
                </div>
                
                {!suit.owned && (
                  <div className="space-y-2">
                    <div className="text-xs text-yellow-400 font-medium">
                      {formatCost(suit.cost)}
                    </div>
                    <button
                      className={`w-full py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                        canAfford(suit.cost)
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-red-600/50 text-red-300 cursor-not-allowed'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (canAfford(suit.cost) && onPurchaseItem) {
                          onPurchaseItem({
                            id: suit.id,
                            name: suit.name,
                            cost: suit.cost
                          })
                        }
                      }}
                      disabled={!canAfford(suit.cost)}
                    >
                      <ShoppingCart className="w-3 h-3 inline mr-1" />
                      {canAfford(suit.cost) ? 'Purchase' : 'Insufficient Funds'}
                    </button>
                  </div>
                )}
                
                {suit.owned && configuration.clothing.suit === suit.id && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dress Shirts */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Dress Shirts</h4>
        <div className="grid grid-cols-4 gap-3">
          {DRESS_SHIRTS.map((shirt) => (
            <button
              key={shirt.id}
              className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                configuration.clothing.shirt === shirt.id
                  ? `${getRarityColor(shirt.rarity)} shadow-lg scale-105`
                  : `${getRarityColor(shirt.rarity)} hover:scale-102`
              } ${!shirt.owned ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => shirt.owned && updateClothing({ shirt: shirt.id })}
              disabled={!shirt.owned}
            >
              <div className="text-center">
                <div className="text-xs font-medium text-white">{shirt.name}</div>
                <span className={`inline-block mt-1 px-1 py-0.5 text-xs rounded ${getRarityBadgeColor(shirt.rarity)}`}>
                  {shirt.rarity.charAt(0).toUpperCase()}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Ties & Accessories */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Ties & Accessories</h4>
        <div className="grid grid-cols-3 gap-4">
          {TIES_AND_ACCESSORIES.map((item) => (
            <div
              key={item.id}
              className={`relative p-3 rounded-xl border-2 transition-all duration-200 ${
                configuration.clothing.tie === item.id || configuration.clothing.accessories.includes(item.id)
                  ? `${getRarityColor(item.rarity)} shadow-lg scale-105`
                  : `${getRarityColor(item.rarity)} hover:scale-102`
              } ${!item.owned ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={() => {
                if (!item.owned) return
                if (item.category === 'tie') {
                  updateClothing({ tie: item.id })
                } else {
                  const accessories = configuration.clothing.accessories.includes(item.id)
                    ? configuration.clothing.accessories.filter(acc => acc !== item.id)
                    : [...configuration.clothing.accessories, item.id]
                  updateClothing({ accessories })
                }
              }}
            >
              <div className="text-center">
                <div className="mb-2">
                  {item.category === 'tie' ? (
                    <div className="w-8 h-8 bg-gradient-to-b from-red-500 to-red-700 rounded-sm mx-auto" />
                  ) : (
                    <Award className="w-6 h-6 text-yellow-400 mx-auto" />
                  )}
                </div>
                <div className="text-xs font-medium text-white mb-1">{item.name}</div>
                <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${getRarityBadgeColor(item.rarity)}`}>
                  {item.rarity.charAt(0).toUpperCase()}
                </span>
                
                {!item.owned && (
                  <div className="mt-2 text-xs text-yellow-400">
                    🔒 Locked
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Professional Standards Notice */}
      <div className="bg-blue-600/10 rounded-xl p-4 border border-blue-500/20">
        <div className="flex items-start space-x-3">
          <Shirt className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="text-sm font-semibold text-blue-300 mb-1">Banking Industry Standards</h5>
            <p className="text-xs text-blue-200 opacity-80">
              Professional business attire is required. Conservative colors and classic styles are preferred for client-facing roles.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}