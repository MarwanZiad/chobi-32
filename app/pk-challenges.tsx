import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { usePK, PKProvider } from '@/hooks/use-pk-store';
import PKChallengeScreen from '@/components/PKChallengeScreen';
import PKInvitationModal from '@/components/PKInvitationModal';
import CreatePKChallengeModal from '@/components/CreatePKChallengeModal';
import type { PKChallenge, PKInvitation } from '@/types/pk-challenge';
import { 
  Sword, 
  Trophy, 
  Users, 
  Clock, 
  Plus, 
  Bell,
  Flame,
  Crown,
  Zap
} from 'lucide-react-native';

function PKChallengesContent() {
  const {
    activeChallenges,
    pendingInvitations,
    isLoading,
    refreshActiveChallenges,
    refreshInvitations,
  } = usePK();

  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [selectedInvitation, setSelectedInvitation] = useState<PKInvitation | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refreshActiveChallenges(),
        refreshInvitations(),
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  const formatTimeRemaining = (challenge: PKChallenge): string => {
    if (!challenge.endTime) return '';
    const remaining = Math.max(0, new Date(challenge.endTime).getTime() - Date.now());
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderChallengeCard = (challenge: PKChallenge) => {
    const isActive = challenge.status === 'active';
    const timeRemaining = isActive ? formatTimeRemaining(challenge) : '';

    return (
      <TouchableOpacity
        key={challenge.id}
        style={styles.challengeCard}
        onPress={() => setSelectedChallenge(challenge.id)}
      >
        <LinearGradient
          colors={isActive ? ['#FF6B6B', '#4ECDC4'] : ['#667eea', '#764ba2']}
          style={styles.challengeGradient}
        >
          <View style={styles.challengeHeader}>
            <View style={styles.challengeTypeContainer}>
              {challenge.type === '1v1' ? (
                <Sword size={20} color="white" />
              ) : (
                <Users size={20} color="white" />
              )}
              <Text style={styles.challengeType}>
                {challenge.type === '1v1' ? '1 ضد 1' : '4 لاعبين'}
              </Text>
            </View>
            
            <View style={styles.statusContainer}>
              {isActive && <Zap size={16} color="#FFD700" />}
              <Text style={[styles.statusText, { 
                color: isActive ? '#FFD700' : 'rgba(255, 255, 255, 0.8)' 
              }]}>
                {isActive ? 'نشط' : challenge.status === 'completed' ? 'انتهى' : 'في الانتظار'}
              </Text>
            </View>
          </View>

          <Text style={styles.challengeTitle}>{challenge.title}</Text>
          
          {challenge.description && (
            <Text style={styles.challengeDescription} numberOfLines={2}>
              {challenge.description}
            </Text>
          )}

          <View style={styles.challengeStats}>
            <View style={styles.stat}>
              <Users size={16} color="rgba(255, 255, 255, 0.8)" />
              <Text style={styles.statText}>{challenge.viewerCount}</Text>
            </View>
            
            <View style={styles.stat}>
              <Trophy size={16} color="rgba(255, 255, 255, 0.8)" />
              <Text style={styles.statText}>{challenge.totalGifts}</Text>
            </View>
            
            {isActive && timeRemaining && (
              <View style={styles.stat}>
                <Clock size={16} color="#FFD700" />
                <Text style={[styles.statText, { color: '#FFD700' }]}>
                  {timeRemaining}
                </Text>
              </View>
            )}
          </View>

          {challenge.status === 'completed' && (challenge.winnerId || challenge.winnerTeam) && (
            <View style={styles.winnerBadge}>
              <Crown size={16} color="#FFD700" />
              <Text style={styles.winnerText}>
                فائز: {challenge.winnerTeam ? `الفريق ${challenge.winnerTeam === 'team1' ? 'الأول' : 'الثاني'}` : 'محدد'}
              </Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderInvitationCard = (invitation: PKInvitation) => {
    if (!invitation.challenge || !invitation.inviter) return null;

    return (
      <TouchableOpacity
        key={invitation.id}
        style={styles.invitationCard}
        onPress={() => setSelectedInvitation(invitation)}
      >
        <LinearGradient
          colors={['#FF6B6B', '#FF8E8E']}
          style={styles.invitationGradient}
        >
          <View style={styles.invitationHeader}>
            <Bell size={20} color="white" />
            <Text style={styles.invitationTitle}>دعوة تحدي جديدة!</Text>
          </View>
          
          <Text style={styles.inviterName}>
            من: {invitation.inviter.displayName}
            {invitation.inviter.isVerified && ' ✓'}
          </Text>
          
          <Text style={styles.challengeName}>
            {invitation.challenge.title}
          </Text>
          
          <View style={styles.invitationDetails}>
            <Text style={styles.invitationDetail}>
              {invitation.challenge.type === '1v1' ? 'تحدي فردي' : 'تحدي جماعي'}
            </Text>
            <Text style={styles.invitationDetail}>
              {Math.floor(invitation.challenge.duration / 60)} دقيقة
            </Text>
          </View>
          
          <View style={styles.urgentBadge}>
            <Flame size={14} color="white" />
            <Text style={styles.urgentText}>عاجل!</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'تحديات PK',
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' },
        }} 
      />

      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.background}
      >
        {/* Header Stats */}
        <View style={styles.headerStats}>
          <View style={styles.statCard}>
            <Sword size={24} color="#4ECDC4" />
            <Text style={styles.statNumber}>{activeChallenges.length}</Text>
            <Text style={styles.statLabel}>تحديات نشطة</Text>
          </View>
          
          <View style={styles.statCard}>
            <Bell size={24} color="#FF6B6B" />
            <Text style={styles.statNumber}>{pendingInvitations.length}</Text>
            <Text style={styles.statLabel}>دعوات معلقة</Text>
          </View>
          
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => setShowCreateModal(true)}
          >
            <Plus size={24} color="white" />
            <Text style={styles.createButtonText}>إنشاء تحدي</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="white"
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Pending Invitations */}
          {pendingInvitations.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <Bell size={20} color="#FF6B6B" /> دعوات التحدي ({pendingInvitations.length})
              </Text>
              {pendingInvitations.map(renderInvitationCard)}
            </View>
          )}

          {/* Active Challenges */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Zap size={20} color="#4ECDC4" /> التحديات النشطة ({activeChallenges.filter(c => c.status === 'active').length})
            </Text>
            {activeChallenges.filter(c => c.status === 'active').length > 0 ? (
              activeChallenges
                .filter(c => c.status === 'active')
                .map(renderChallengeCard)
            ) : (
              <View style={styles.emptyState}>
                <Sword size={48} color="rgba(255, 255, 255, 0.3)" />
                <Text style={styles.emptyText}>لا توجد تحديات نشطة حالياً</Text>
                <Text style={styles.emptySubtext}>أنشئ تحدي جديد أو انتظر دعوة!</Text>
              </View>
            )}
          </View>

          {/* Recent Challenges */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Trophy size={20} color="#FFD700" /> التحديات الأخيرة
            </Text>
            {activeChallenges.filter(c => c.status !== 'active').length > 0 ? (
              activeChallenges
                .filter(c => c.status !== 'active')
                .slice(0, 5)
                .map(renderChallengeCard)
            ) : (
              <View style={styles.emptyState}>
                <Trophy size={48} color="rgba(255, 255, 255, 0.3)" />
                <Text style={styles.emptyText}>لا توجد تحديات سابقة</Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Modals */}
        {selectedChallenge && (
          <PKChallengeScreen
            challengeId={selectedChallenge}
            onClose={() => setSelectedChallenge(null)}
          />
        )}

        {selectedInvitation && (
          <PKInvitationModal
            invitation={selectedInvitation}
            visible={!!selectedInvitation}
            onClose={() => setSelectedInvitation(null)}
          />
        )}

        <CreatePKChallengeModal
          visible={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      </LinearGradient>
    </View>
  );
}

export default function PKChallengesPage() {
  return (
    <PKProvider>
      <PKChallengesContent />
    </PKProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  headerStats: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  statNumber: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 4,
  },
  createButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  createButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  challengeCard: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  challengeGradient: {
    padding: 20,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  challengeTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  challengeType: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  challengeTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  challengeDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    marginBottom: 15,
  },
  challengeStats: {
    flexDirection: 'row',
    gap: 20,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  winnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 10,
    alignSelf: 'flex-start',
    gap: 5,
  },
  winnerText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
  },
  invitationCard: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  invitationGradient: {
    padding: 20,
    position: 'relative',
  },
  invitationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  invitationTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inviterName: {
    color: 'white',
    fontSize: 14,
    marginBottom: 8,
  },
  challengeName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  invitationDetails: {
    flexDirection: 'row',
    gap: 15,
  },
  invitationDetail: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
  },
  urgentBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  urgentText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
  },
  emptySubtext: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
});