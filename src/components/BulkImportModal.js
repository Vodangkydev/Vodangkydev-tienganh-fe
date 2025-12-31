import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

// Auto-detect word type based on common patterns
const detectWordType = (englishWord) => {
  const word = englishWord.toLowerCase().trim();
  
  // Common prepositions
  const prepositions = [
    'to', 'from', 'at', 'in', 'on', 'with', 'by', 'for', 'about', 'into',
    'through', 'during', 'including', 'until', 'against', 'among', 'throughout',
    'despite', 'towards', 'upon', 'concerning', 'of', 'off', 'over', 'out',
    'below', 'above', 'up', 'down', 'between', 'behind', 'beside', 'beneath',
    'across', 'along', 'around', 'near', 'past', 'within', 'without', 'before',
    'after', 'since', 'toward', 'under', 'underneath', 'among', 'beyond'
  ];
  
  if (prepositions.includes(word)) {
    return 'preposition';
  }
  
  // Common verb endings
  if (word.endsWith('ing') || word.endsWith('ed') || word.endsWith('ize') || word.endsWith('ise')) {
    return 'verb';
  }
  
  // Common adjective endings
  if (word.endsWith('ful') || word.endsWith('less') || word.endsWith('ous') || word.endsWith('able') || word.endsWith('ible')) {
    return 'adjective';
  }
  
  // Common adverb endings
  if (word.endsWith('ly')) {
    return 'adverb';
  }
  
  // Default to noun
  return 'noun';
};

const BulkImportModal = ({ 
  isOpen, 
  onClose, 
  onImport, 
  isMobile 
}) => {
  const [bulkData, setBulkData] = useState('');
  const [termDelimiter, setTermDelimiter] = useState('custom');
  const [entryDelimiter, setEntryDelimiter] = useState('newline');
  const [customTermDelimiter, setCustomTermDelimiter] = useState(':');
  const [customEntryDelimiter] = useState('');
  const [previewData, setPreviewData] = useState([]);

  const parseBulkData = () => {
    if (!bulkData.trim()) {
      setPreviewData([]);
      return;
    }

    let entrySep, termSep;
    
    // Set entry delimiter
    switch (entryDelimiter) {
      case 'newline':
        entrySep = '\n';
        break;
      case 'semicolon':
        entrySep = ';';
        break;
      case 'custom':
        entrySep = customEntryDelimiter;
        break;
      default:
        entrySep = '\n';
    }

    // Set term delimiter
    switch (termDelimiter) {
      case 'tab':
        termSep = '\t';
        break;
      case 'comma':
        termSep = ',';
        break;
      case 'custom':
        termSep = customTermDelimiter;
        break;
      default:
        termSep = '\t';
    }

    const entries = bulkData.split(entrySep).filter(entry => entry.trim());
    const parsed = [];

    entries.forEach((entry, index) => {
      const parts = entry.split(termSep);
      if (parts.length >= 2) {
        const englishWord = parts[0].trim();
        parsed.push({
          id: index + 1,
          english: englishWord,
          vietnamese: parts[1].trim(),
          type: detectWordType(englishWord),
          pronunciation: '',
          image_url: '',
          difficulty: 1
        });
      }
    });

    setPreviewData(parsed);
  };

  // Update preview when data or delimiters change
  useEffect(() => {
    parseBulkData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bulkData, termDelimiter, entryDelimiter, customTermDelimiter, customEntryDelimiter]);

  const handleImport = () => {
    if (previewData.length === 0) {
      return;
    }
    onImport(previewData);
    // Reset form
    setBulkData('');
    setPreviewData([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#2d3748',
        borderRadius: '15px',
        padding: isMobile ? '25px 20px' : '30px',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflow: 'auto',
        color: 'white'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: isMobile ? '1.3rem' : '1.5rem' }}>Nhập dữ liệu.</h2>
            <p style={{ margin: '5px 0 0 0', color: '#a0aec0', fontSize: isMobile ? '0.85rem' : '0.9rem' }}>
              Chép và dán dữ liệu ở đây (từ Word, Excel, Google Docs, v.v.)
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1.5rem',
              padding: '5px'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Main Input Area */}
        <textarea
          value={bulkData}
          onChange={(e) => setBulkData(e.target.value)}
          placeholder="Ví dụ:
confident : tự tin
friendly : thân thiện
motivated : có động lực
patient : kiên nhẫn
flexible : linh hoạt"
          style={{
            width: '100%',
            height: '180px',
            background: '#1a202c',
            border: '1px solid #4a5568',
            borderRadius: '8px',
            padding: '15px',
            color: 'white',
            fontSize: '1rem',
            resize: 'vertical',
            fontFamily: 'inherit',
            lineHeight: '1.5',
            marginBottom: '20px',
            minHeight: isMobile ? '120px' : '180px',
            maxHeight: '300px'
          }}
        />

        {/* Delimiter Options */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
          gap: isMobile ? '15px' : '20px', 
          marginBottom: '20px' 
        }}>
          {/* Term-Definition Delimiter */}
          <div>
            <h4 style={{ margin: '0 0 10px 0', fontSize: isMobile ? '0.9rem' : '1rem' }}>Giữa thuật ngữ và định nghĩa</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="termDelimiter"
                    value="custom"
                    checked={termDelimiter === 'custom'}
                    onChange={(e) => setTermDelimiter(e.target.value)}
                    style={{ accentColor: '#4299e1' }}
                  />
                  Dấu hai chấm (:)
                </label>
                {termDelimiter === 'custom' && (
                  <input
                    type="text"
                    value={customTermDelimiter}
                    onChange={(e) => setCustomTermDelimiter(e.target.value)}
                    placeholder="Nhập ký tự"
                    style={{
                      background: '#1a202c',
                      border: '1px solid #4a5568',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      color: 'white',
                      fontSize: '0.9rem',
                      width: '80px'
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Entry Delimiter */}
          <div>
            <h4 style={{ margin: '0 0 10px 0', fontSize: isMobile ? '0.9rem' : '1rem' }}>Giữa các thẻ</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="entryDelimiter"
                  value="newline"
                  checked={entryDelimiter === 'newline'}
                  onChange={(e) => setEntryDelimiter(e.target.value)}
                  style={{ accentColor: '#4299e1' }}
                />
                Dòng mới
              </label>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: isMobile ? '0.9rem' : '1rem' }}>
            Xem trước {previewData.length} thẻ
          </h4>
          <div style={{
            background: '#1a202c',
            border: '1px solid #4a5568',
            borderRadius: '8px',
            padding: isMobile ? '12px' : '15px',
            minHeight: isMobile ? '80px' : '100px',
            maxHeight: isMobile ? '150px' : '200px',
            overflow: 'auto',
            fontSize: isMobile ? '0.85rem' : '0.9rem'
          }}>
            {previewData.length === 0 ? (
              <p style={{ color: '#a0aec0', margin: 0, fontStyle: 'italic' }}>
                Không có nội dung để xem trước
              </p>
            ) : (
              previewData.map((item, index) => (
                <div key={index} style={{ 
                  padding: isMobile ? '8px 0' : '10px 0', 
                  borderBottom: index < previewData.length - 1 ? '1px solid #4a5568' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: isMobile ? 'wrap' : 'nowrap',
                  gap: isMobile ? '4px' : '0'
                }}>
                  <span style={{ color: '#68d391', fontWeight: '500', fontSize: isMobile ? '0.9rem' : '1rem' }}>{item.english}</span>
                  <select
                    value={item.type}
                    onChange={(e) => {
                      const newPreviewData = [...previewData];
                      newPreviewData[index].type = e.target.value;
                      setPreviewData(newPreviewData);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      color: '#9ca3af',
                      fontSize: isMobile ? '0.75rem' : '0.85rem',
                      width: isMobile ? '80px' : '120px',
                      textAlign: 'center',
                      appearance: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="noun">(noun)</option>
                    <option value="verb">(verb)</option>
                    <option value="adjective">(adjective)</option>
                    <option value="adverb">(adverb)</option>
                    <option value="preposition">(preposition)</option>
                    <option value="other">(other)</option>
                  </select>
                  <span style={{ color: '#fbb6ce', fontSize: isMobile ? '0.9rem' : '1rem' }}>{item.vietnamese}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'flex-end',
          gap: isMobile ? '15px' : '20px',
          marginTop: '30px'
        }}>
          <button 
            onClick={onClose}
            style={{
              background: '#4a5568',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: isMobile ? '14px 20px' : '12px 25px',
              cursor: 'pointer',
              fontSize: isMobile ? '1rem' : '1.1rem',
              transition: 'all 0.3s ease',
              width: isMobile ? '100%' : 'auto',
              minHeight: '48px'
            }}
            onMouseEnter={(e) => e.target.style.background = '#2d3748'}
            onMouseLeave={(e) => e.target.style.background = '#4a5568'}
          >
            Hủy nhập
          </button>
          <button 
            onClick={handleImport}
            disabled={previewData.length === 0}
            style={{
              background: previewData.length === 0 ? '#4a5568' : '#4299e1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: isMobile ? '14px 20px' : '12px 25px',
              cursor: previewData.length === 0 ? 'not-allowed' : 'pointer',
              fontSize: isMobile ? '1rem' : '1.1rem',
              transition: 'all 0.3s ease',
              width: isMobile ? '100%' : 'auto',
              minHeight: '48px',
              opacity: previewData.length === 0 ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (previewData.length > 0) e.target.style.background = '#3182ce';
            }}
            onMouseLeave={(e) => {
              if (previewData.length > 0) e.target.style.background = '#4299e1';
            }}
          >
            Nhập
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkImportModal;

