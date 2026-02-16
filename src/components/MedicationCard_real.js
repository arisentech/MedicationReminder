// ============================================
// src/components/MedicationCard.js
// ============================================
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MedicationCard({ medication, onDelete, onEdit }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="medical" size={24} color="#4A90E2" />
          <Text style={styles.name}>{medication.name}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
            <Ionicons name="create-outline" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
            <Ionicons name="trash-outline" size={24} color="#ff4444" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Dosage:</Text>
          <Text style={styles.detailValue}>{medication.dosage}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Frequency:</Text>
          <Text style={styles.detailValue}>{medication.frequency}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Times:</Text>
          <Text style={styles.detailValue}>{medication.times.join(', ')}</Text>
        </View>
        {medication.notes && (
          <View style={styles.notesRow}>
            <Text style={styles.notes}>{medication.notes}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 5,
    marginLeft: 10,
  },
  details: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  notesRow: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  notes: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});