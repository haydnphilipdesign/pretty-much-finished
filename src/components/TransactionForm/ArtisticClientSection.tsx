import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';
import { ArtisticClientItem } from './ArtisticClientItem';
import type { Client } from '@/types/transaction';

interface ArtisticClientSectionProps {
  clients: Client[];
  onChange: (clients: Client[]) => void;
  onAddClient: () => void;
  onRemoveClient: (id: string) => void;
  onClientChange: (id: string, field: keyof Client, value: any) => void;
  role?: string;
}

export function ArtisticClientSection({
  clients,
  onChange,
  onAddClient,
  onRemoveClient,
  onClientChange,
  role = 'LISTING AGENT'
}: ArtisticClientSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const handleAddClient = () => {
    onAddClient();
  };

  return (
    <div className="art-form-section">
      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="mb-6">
          <h2 className="art-header text-2xl sm:text-3xl mb-2">Client Composition</h2>
          <p className="art-subheader">Paint the portrait of your clients</p>
        </div>

        {clients.map((client, index) => (
          <ArtisticClientItem
            key={client.id}
            client={client}
            index={index}
            onRemove={onRemoveClient}
            onChange={onClientChange}
          />
        ))}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="add-client-button"
          onClick={handleAddClient}
          type="button"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          Add {role === 'LISTING AGENT' ? 'Another Seller' : 'Another Buyer'}
        </motion.button>
      </motion.div>
    </div>
  );
}
