using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ECMASynth.API.Models;
using ECMASynth.API.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ECMASynth.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SynthPresetsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SynthPresetsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SynthPreset>>> GetPresets()
        {
            return await _context.SynthPresets.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SynthPreset>> GetPreset(int id)
        {
            var preset = await _context.SynthPresets.FindAsync(id);
            if (preset == null)
            {
                return NotFound();
            }
            return preset;
        }

        [HttpPost]
        public async Task<ActionResult<SynthPreset>> CreatePreset(SynthPreset preset)
        {
            preset.CreatedAt = DateTime.UtcNow;
            preset.UpdatedAt = DateTime.UtcNow;
            
            _context.SynthPresets.Add(preset);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPreset), new { id = preset.Id }, preset);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePreset(int id)
        {
            var preset = await _context.SynthPresets.FindAsync(id);
            if (preset == null)
            {
                return NotFound();
            }

            _context.SynthPresets.Remove(preset);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
} 