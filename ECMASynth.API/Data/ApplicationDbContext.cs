using Microsoft.EntityFrameworkCore;
using ECMASynth.API.Models;

namespace ECMASynth.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<SynthPreset> SynthPresets { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<SynthPreset>()
                .Property(p => p.Name)
                .IsRequired();

            modelBuilder.Entity<SynthPreset>()
                .Property(p => p.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            modelBuilder.Entity<SynthPreset>()
                .Property(p => p.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
        }
    }
} 