import React, { useState } from 'react';
import { Volume2, Download, Loader2 } from 'lucide-react';

function App() {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convertToSpeech = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    setError(null);
    setAudioUrl(null);
    
    try {
      const response = await fetch('https://host.vreausacopiez.com/webhook/77a850a6-f3d9-4b37-9ea3-47a30a559fef', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      
      if (!response.ok) {
        throw new Error('Conversion failed');
      }
      
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
    } catch (err) {
      setError('Failed to convert text to speech');
    } finally {
      setLoading(false);
    }
  };

  const downloadAudio = () => {
    if (audioUrl) {
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = 'speech.mp3';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Input Section */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text here..."
            className="w-full h-32 bg-transparent border-none outline-none text-white placeholder-white/50 text-lg resize-none font-light"
          />
          
          <div className="flex justify-center mt-6">
            <button
              onClick={convertToSpeech}
              disabled={loading || !text.trim()}
              className="flex items-center gap-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 text-white px-8 py-4 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <Volume2 className="w-5 h-5" />
                  Convert to Speech
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mt-6 bg-red-500/10 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20 text-center">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Audio Player */}
        {audioUrl && (
          <div className="mt-6 bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <audio
                controls
                src={audioUrl}
                className="flex-1 mr-4 h-12 rounded-xl"
                style={{
                  filter: 'invert(1) hue-rotate(180deg)',
                }}
              />
              <button
                onClick={downloadAudio}
                className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                title="Download"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;