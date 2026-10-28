using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using dotnetapp.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace dotnetapp.Data
{
    public class ApplicationDbContext
        : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Feedback> Feedbacks { get; set; }
         public DbSet<User> Users { get; set; }
        public DbSet<Feed> Feeds { get; set; }
        public DbSet<Medicine> Medicines { get; set; }
        public DbSet<Request> Requests { get; set; }
        public DbSet<Livestock> Livestocks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //  REQUIRED for Identity
            base.OnModelCreating(modelBuilder);

            //  Prevent cascading delete from User → Requests
            modelBuilder.Entity<Request>()
                .HasOne(r => r.User)
                .WithMany()
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            //  Prevent cascading delete from User → Livestocks
            modelBuilder.Entity<Livestock>()
                .HasOne(l => l.User)
                .WithMany()
                .HasForeignKey(l => l.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            //  Allow cascading delete from Livestock → Requests
            modelBuilder.Entity<Request>()
                .HasOne(r => r.Livestock)
                .WithMany()
                .HasForeignKey(r => r.LivestockId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}