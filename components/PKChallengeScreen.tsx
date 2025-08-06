import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { usePK } from '@/hooks/use-pk-store';
import { trpc } from '@/lib/trpc';
import type { PKChallenge, PKParticipant } from '@/types/pk-challenge';
import { Sword, Crown, Gift, Users, Clock, Trophy } from 'lucide-react-native';
import UserAvatar from '@/components/UserAvatar';
import UserName from '@/components/UserName';

const { width, height } = Dimensions.get('window');

interface PKChallengeScreenProps {
  challengeId: string;
  onClose: () => void;
}

export default function PKChallengeScreen({ challengeId, onClose }: PKChallengeScreenProps) {
  const { sendPKGift, getTimeRemaining, formatTimeRemaining, getParticipantTeam, getTeamScore } = usePK();
  const [challenge, setChallenge] = useState<PKChallenge | null>(null);
  const [participants, setParticipants] = useState<PKParticipant[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [showGiftPanel, setShowGiftPanel] = useState<boolean>(false);
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);

  // Get challenge details
  const challengeQuery = trpc.pk.getChallenge.useQuery(
    { challengeId },
    {
      refetchInterval: 2000, // Refresh every 2 seconds for real-time updates
    }
  );

  // Get available gifts
  const giftsQuery = trpc.gifts.getAvailableGifts.useQuery();

  useEffect(() => {
    if (challengeQuery.data?.success && challengeQuery.data.challenge && challengeQuery.data.participants) {
      setChallenge(challengeQuery.data.challenge);
      const validParticipants = challengeQuery.data.participants
        .filter((p): p is NonNullable<typeof p> => p !== null)
        .map((p): PKParticipant => ({
          id: p.id,
          username: p.username,
          displayName: p.displayName,
          avatar: p.avatar || undefined,
          level: p.level,
          isVerified: p.isVerified
        }));
      setParticipants(validParticipants);
    }
  }, [challengeQuery.data]);

  // Update timer
  useEffect(() => {
    if (!challenge) return;

    const updateTimer = () => {
      const remaining = getTimeRemaining(challenge);
      setTimeRemaining(remaining);
      
      if (remaining <= 0 && challenge.status === 'active') {
        // Challenge ended
        challengeQuery.refetch();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [challenge, getTimeRemaining]);

  const handleSendGift = async (giftId: string, quantity: number = 1) => {
    if (!selectedParticipant || !challenge) return;

    try {
      await sendPKGift(challenge.id, selectedParticipant, giftId, quantity);
      setShowGiftPanel(false);
      setSelectedParticipant(null);
    } catch (error) {
      Alert.alert('خطأ', 'فشل في إرسال الهدية');
    }
  };

  const renderParticipantCard = (participant: PKParticipant, score: number, position: 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right') => {
    const team = challenge ? getParticipantTeam(challenge, participant.id) : null;
    const isWinner = challenge?.winnerId === participant.id || 
      (challenge?.winnerTeam && team === challenge.winnerTeam);

    const cardStyle = getCardStyle(position);

    return (
      <TouchableOpacity
        key={participant.id}
        style={[styles.participantCard, cardStyle]}
        onPress={() => {
          setSelectedParticipant(participant.id);
          setShowGiftPanel(true);
        }}
      >
        <LinearGradient
          colors={team === 'team1' ? ['#FF6B6B', '#FF8E8E'] : team === 'team2' ? ['#4ECDC4', '#6BCCC4'] : ['#667eea', '#764ba2']}
          style={styles.participantGradient}
        >
          {isWinner && (
            <View style={styles.winnerBadge}>
              <Crown size={16} color="#FFD700" />
            </View>
          )}
          
          <UserAvatar 
            userId={participant.id}
            imageUrl={participant.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.displayName)}&background=random`}
            size={60}
            testID={`pk-participant-avatar-${participant.id}`}
          />
          
          <UserName 
            userId={participant.id}
            username={participant.username}
            arabicUsername={participant.displayName}
            isVerified={participant.isVerified}
            style={styles.participantNameContainer}
            textStyle={styles.participantName}
            testID={`pk-participant-name-${participant.id}`}
          />
          
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>{score}</Text>
            <Text style={styles.scoreLabel}>نقطة</Text>
          </View>
          
          {participant.isVerified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓</Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const getCardStyle = (position: string) => {
    const baseSize = width * 0.4;
    const smallSize = width * 0.35;
    
    switch (position) {
      case 'left':
        return {
          position: 'absolute' as const,
          left: 20,
          top: height * 0.3,
          width: baseSize,
          height: baseSize * 1.2,
        };
      case 'right':
        return {
          position: 'absolute' as const,
          right: 20,
          top: height * 0.3,
          width: baseSize,
          height: baseSize * 1.2,
        };
      case 'top-left':
        return {
          position: 'absolute' as const,
          left: 10,
          top: height * 0.15,
          width: smallSize,
          height: smallSize * 1.1,
        };
      case 'top-right':
        return {
          position: 'absolute' as const,
          right: 10,
          top: height * 0.15,
          width: smallSize,
          height: smallSize * 1.1,
        };
      case 'bottom-left':
        return {
          position: 'absolute' as const,
          left: 10,
          bottom: height * 0.15,
          width: smallSize,
          height: smallSize * 1.1,
        };
      case 'bottom-right':
        return {
          position: 'absolute' as const,
          right: 10,
          bottom: height * 0.15,
          width: smallSize,
          height: smallSize * 1.1,
        };
      default:
        return {};
    }
  };

  const renderChallengeLayout = () => {
    if (!challenge || !participants.length) return null;

    if (challenge.type === '1v1') {
      const challenger = participants.find(p => p.id === challenge.challengerId);
      const opponent = participants.find(p => p.id !== challenge.challengerId);
      
      if (!challenger || !opponent) return null;

      return (
        <>
          {renderParticipantCard(challenger, challenge.scores[challenger.id] || 0, 'left')}
          {renderParticipantCard(opponent, challenge.scores[opponent.id] || 0, 'right')}
          
          {/* VS Badge */}
          <View style={styles.vsBadge}>
            <LinearGradient colors={['#FF6B6B', '#4ECDC4']} style={styles.vsGradient}>
              <Sword size={24} color="white" />
              <Text style={styles.vsText}>VS</Text>
            </LinearGradient>
          </View>
        </>
      );
    } else {
      // 4-player layout
      const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;
      return (
        <>
          {participants.map((participant, index) => 
            renderParticipantCard(
              participant, 
              challenge.scores[participant.id] || 0, 
              positions[index]
            )
          )}
          
          {/* Team scores */}
          <View style={styles.teamScoresContainer}>
            <View style={styles.teamScore}>
              <Text style={styles.teamLabel}>الفريق الأول</Text>
              <Text style={styles.teamScoreText}>{getTeamScore(challenge, 'team1')}</Text>
            </View>
            <View style={styles.teamScore}>
              <Text style={styles.teamLabel}>الفريق الثاني</Text>
              <Text style={styles.teamScoreText}>{getTeamScore(challenge, 'team2')}</Text>
            </View>
          </View>
        </>
      );
    }
  };

  if (!challenge) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>جاري تحميل التحدي...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.background}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
            <Text style={styles.challengeTitle}>{challenge.title}</Text>
            <Text style={styles.challengeType}>
              {challenge.type === '1v1' ? 'تحدي فردي' : 'تحدي جماعي'}
            </Text>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Users size={16} color="#fff" />
              <Text style={styles.statText}>{challenge.viewerCount}</Text>
            </View>
            <View style={styles.stat}>
              <Gift size={16} color="#fff" />
              <Text style={styles.statText}>{challenge.totalGifts}</Text>
            </View>
          </View>
        </View>

        {/* Timer */}
        {challenge.status === 'active' && (
          <View style={styles.timerContainer}>
            <Clock size={20} color="#FFD700" />
            <Text style={styles.timerText}>
              {formatTimeRemaining(timeRemaining)}
            </Text>
          </View>
        )}

        {/* Challenge Status */}
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, { 
            color: challenge.status === 'active' ? '#4ECDC4' : 
                   challenge.status === 'completed' ? '#FFD700' : '#FF6B6B' 
          }]}>
            {challenge.status === 'active' ? 'نشط الآن' :
             challenge.status === 'completed' ? 'انتهى' :
             challenge.status === 'pending' ? 'في الانتظار' : 'ملغي'}
          </Text>
        </View>

        {/* Challenge Layout */}
        {renderChallengeLayout()}

        {/* Winner Announcement */}
        {challenge.status === 'completed' && (challenge.winnerId || challenge.winnerTeam) && (
          <View style={styles.winnerContainer}>
            <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.winnerBadge}>
              <Trophy size={24} color="white" />
              <Text style={styles.winnerText}>
                {challenge.winnerId 
                  ? `الفائز: ${participants.find(p => p.id === challenge.winnerId)?.displayName}`
                  : `الفريق الفائز: ${challenge.winnerTeam === 'team1' ? 'الأول' : 'الثاني'}`
                }
              </Text>
            </LinearGradient>
          </View>
        )}

        {/* Gift Panel */}
        {showGiftPanel && (
          <View style={styles.giftPanel}>
            <View style={styles.giftPanelContent}>
              <Text style={styles.giftPanelTitle}>اختر هدية</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {giftsQuery.data?.gifts?.map((gift) => (
                  <TouchableOpacity
                    key={gift.id}
                    style={styles.giftItem}
                    onPress={() => handleSendGift(gift.id)}
                  >
                    <Text style={styles.giftEmoji}>{gift.emoji}</Text>
                    <Text style={styles.giftName}>{gift.name}</Text>
                    <Text style={styles.giftPrice}>{gift.price}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.cancelGiftButton}
                onPress={() => setShowGiftPanel(false)}
              >
                <Text style={styles.cancelGiftText}>إلغاء</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  challengeTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  challengeType: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  timerText: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  participantCard: {
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  participantGradient: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  winnerBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 15,
    padding: 5,
  },
  participantAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  participantNameContainer: {
    marginBottom: 10,
  },
  participantName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  scoreLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#4ECDC4',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  vsBadge: {
    position: 'absolute',
    top: height * 0.45,
    left: width * 0.5 - 40,
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
  },
  vsGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vsText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  teamScoresContainer: {
    position: 'absolute',
    top: height * 0.5,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  teamScore: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
  },
  teamLabel: {
    color: 'white',
    fontSize: 14,
    marginBottom: 5,
  },
  teamScoreText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  winnerContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  winnerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  giftPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  giftPanelContent: {
    alignItems: 'center',
  },
  giftPanelTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  giftItem: {
    alignItems: 'center',
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    minWidth: 80,
  },
  giftEmoji: {
    fontSize: 30,
    marginBottom: 5,
  },
  giftName: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 3,
  },
  giftPrice: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cancelGiftButton: {
    marginTop: 15,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  cancelGiftText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});