using System;
using System.ComponentModel.DataAnnotations;

namespace ECMASynth.API.Models
{
    public class SynthPreset
    {
        public int Id { get; set; }
        
        [Required]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        public string Envelope { get; set; } = string.Empty;
        
        [Required]
        public string Reverb { get; set; } = string.Empty;
        
        [Required]
        public string Delay { get; set; } = string.Empty;
        
        [Required]
        public string Volume { get; set; } = string.Empty;
        
        [Required]
        public string Oscillator { get; set; } = string.Empty;
        
        [Required]
        public string Filter { get; set; } = string.Empty;
        
        [Required]
        public string GainLimiter { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
} 