ALTER TABLE synth_presets
ADD COLUMN oscillator TEXT NOT NULL DEFAULT '{"count":2,"spread":15}',
ADD COLUMN filter TEXT NOT NULL DEFAULT '{"frequency":2000,"rolloff":-24}',
ADD COLUMN gain_limiter TEXT NOT NULL DEFAULT '{"gain":0.5,"threshold":-12}';

-- Update existing rows with default values
UPDATE synth_presets
SET oscillator = '{"count":2,"spread":15}',
    filter = '{"frequency":2000,"rolloff":-24}',
    gain_limiter = '{"gain":0.5,"threshold":-12}'
WHERE oscillator IS NULL
   OR filter IS NULL
   OR gain_limiter IS NULL; 