import React from 'react';
import { motion } from 'framer-motion';
import { User, Trash2, MoreHorizontal, Mail, Phone, Home, Heart } from 'lucide-react';
import type { Client } from '@/types/transaction';

interface ArtisticClientItemProps {
  client: Client;
  index: number;
  onRemove: (id: string) => void;
  onChange: (id: string, field: keyof Client, value: any) => void;
}

export function ArtisticClientItem({ 
  client, 
  index, 
  onRemove, 
  onChange 
}: ArtisticClientItemProps) {
  return (
    <motion.div 
      className="client-item"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="client-title">
        <User className="h-5 w-5 mr-2 text-amber-500" />
        <h3 className="text-lg font-semibold text-gray-800">Client {index + 1}</h3>
        <div className="ml-auto flex space-x-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600"
            onClick={() => onRemove(client.id)}
            aria-label="Remove client"
          >
            <Trash2 className="h-5 w-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600"
            aria-label="More options"
          >
            <MoreHorizontal className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-1">
          <label htmlFor={`client-${index}-name`} className="block text-sm font-medium text-gray-700">
            Name *
          </label>
          <input
            id={`client-${index}-name`}
            type="text"
            value={client.name}
            onChange={(e) => onChange(client.id, 'name', e.target.value)}
            className="art-input w-full"
            placeholder="Enter full name"
            required
          />
        </div>
        
        <div className="space-y-1">
          <label htmlFor={`client-${index}-email`} className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="relative">
            <input
              id={`client-${index}-email`}
              type="email"
              value={client.email}
              onChange={(e) => onChange(client.id, 'email', e.target.value)}
              className="art-input w-full pl-10"
              placeholder="Enter email address"
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
          </div>
        </div>
        
        <div className="space-y-1">
          <label htmlFor={`client-${index}-phone`} className="block text-sm font-medium text-gray-700">
            Phone *
          </label>
          <div className="relative">
            <input
              id={`client-${index}-phone`}
              type="tel"
              value={client.phone}
              onChange={(e) => onChange(client.id, 'phone', e.target.value)}
              className="art-input w-full pl-10"
              placeholder="123-456-7890"
              required
            />
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
          </div>
        </div>
        
        <div className="space-y-1">
          <label htmlFor={`client-${index}-address`} className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <div className="relative">
            <input
              id={`client-${index}-address`}
              type="text"
              value={client.address || ''}
              onChange={(e) => onChange(client.id, 'address', e.target.value)}
              className="art-input w-full pl-10"
              placeholder="Enter address"
            />
            <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor={`client-${index}-maritalStatus`} className="block text-sm font-medium text-gray-700">
            Marital Status *
          </label>
          <div className="relative">
            <select
              id={`client-${index}-maritalStatus`}
              value={client.maritalStatus}
              onChange={(e) => onChange(client.id, 'maritalStatus', e.target.value)}
              className="art-select w-full pl-10"
              required
            >
              <option value="">Select marital status</option>
              <option value="SINGLE">Single</option>
              <option value="MARRIED">Married</option>
              <option value="DIVORCED">Divorced</option>
              <option value="WIDOWED">Widowed</option>
            </select>
            <Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
          </div>
        </div>
        
        <div className="space-y-1">
          <label htmlFor={`client-${index}-type`} className="block text-sm font-medium text-gray-700">
            Client Type *
          </label>
          <select
            id={`client-${index}-type`}
            value={client.type}
            onChange={(e) => onChange(client.id, 'type', e.target.value)}
            className="art-select w-full"
            required
          >
            <option value="">Select client type</option>
            <option value="BUYER">Buyer</option>
            <option value="SELLER">Seller</option>
          </select>
        </div>
      </div>
      
      <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-br from-transparent to-amber-100 rounded-tl-full opacity-40 z-0" />
    </motion.div>
  );
}
