import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useSendOutreach } from '../../hooks/useInvestor';
import { X, Check, Send } from 'lucide-react';

const getTierLetter = (score) => {
  if (score >= 800) return 'A';
  if (score >= 600) return 'B';
  if (score >= 400) return 'C';
  return 'D';
};

const formatNumber = (num) => {
  if (!num) return '—';
  return Number(num).toLocaleString('en-US');
};

const OutreachModal = ({ startup, onClose }) => {
  const { user } = useAuthStore();
  const sendMutation = useSendOutreach();
  
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const founderName = startup.founderName || 'Founder';
  const tier = getTierLetter(startup.score);
  const raisingStr = startup.metrics?.raising ? `£${formatNumber(startup.metrics.raising)}` : 'your target raise';

  useEffect(() => {
    if (startup && user) {
      setSubject(`Investment Inquiry: ${startup.name} (Theliv: ${startup.score} - Tier ${tier})`);
      setBody(
        `Hi ${founderName},\n\n` +
        `I hope this email finds you well.\n\n` +
        `I saw ${startup.name} on the Theliv platform and was impressed by your profile (Theliv: ${startup.score}/1000 - Tier ${tier}). ` +
        `I'd love to connect and learn more about your progress in ${startup.industry || 'your sector'} and ${raisingStr}.\n\n` +
        `Best regards,\n` +
        `${user.name}`
      );
    }
  }, [startup, user, founderName, tier, raisingStr]);

  const handleSend = () => {
    if (!subject.trim() || !body.trim()) {
      setErrorMsg('Subject and Message body cannot be empty');
      return;
    }

    setErrorMsg('');
    sendMutation.mutate(
      {
        founderId: startup.id,
        subject,
        body
      },
      {
        onSuccess: () => {
          setSent(true);
          setTimeout(() => {
            setSent(false);
            onClose();
          }, 1500);
        },
        onError: (err) => {
          setErrorMsg(err.response?.data?.message || err.message || 'Failed to send outreach email');
        }
      }
    );
  };

  return (
    <div className="iscore-overlay" onClick={onClose}>
      <div className="iscore-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', width: '90%' }}>
        <div className="iscore-header">
          <div className="iscore-title">Email Outreach — {startup.name}</div>
          <button className="iscore-close" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Sender and Recipient Details */}
        <div style={{ backgroundColor: 'var(--panel-2)', padding: '16px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', border: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', marginBottom: '8px' }}>
            <span style={{ width: '60px', color: 'var(--ink-dim)', fontWeight: 600 }}>To:</span>
            <span style={{ color: 'var(--ink)', fontWeight: 500 }}>{founderName} ({startup.name})</span>
          </div>
          <div style={{ display: 'flex' }}>
            <span style={{ width: '60px', color: 'var(--ink-dim)', fontWeight: 600 }}>From:</span>
            <span style={{ color: 'var(--ink)' }}>{user?.name} ({user?.email})</span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}>
            {errorMsg}
          </div>
        )}

        {/* Subject Input */}
        <div className="input-grp" style={{ marginBottom: '16px' }}>
          <label className="input-lbl">Subject</label>
          <input
            type="text"
            className="input filled"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            disabled={sendMutation.isPending || sent}
            placeholder="Email Subject"
            style={{ fontSize: '14px' }}
          />
        </div>

        {/* Body Textarea */}
        <div className="input-grp" style={{ marginBottom: '20px' }}>
          <label className="input-lbl">Message Body</label>
          <textarea
            className="input filled"
            value={body}
            onChange={e => setBody(e.target.value)}
            disabled={sendMutation.isPending || sent}
            placeholder="Write your email here..."
            rows={10}
            style={{ resize: 'vertical', lineHeight: '1.6', fontSize: '14px', fontFamily: 'inherit' }}
          />
        </div>

        {/* Send / Cancel Actions */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button
            className="btn btn-ghost"
            onClick={onClose}
            disabled={sendMutation.isPending || sent}
            style={{ flex: 1 }}
          >
            Cancel
          </button>
          <button
            className="btn btn-accent"
            onClick={handleSend}
            disabled={sendMutation.isPending || sent || !subject.trim() || !body.trim()}
            style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {sent ? (
              <><Check size={16} /> Sent!</>
            ) : sendMutation.isPending ? (
              'Sending...'
            ) : (
              <><Send size={15} /> Send Email</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OutreachModal;
