using Microsoft.EntityFrameworkCore;

using dotnetapp.Models;
using dotnetapp.Data;
using dotnetapp.Exceptions;
using System.Collections.Generic;

using System.Linq;

using System.Threading.Tasks;
using dotnetapp.Data;

namespace dotnetapp.Services

{

    public class FeedService

    {

        private readonly ApplicationDbContext _context;

        public FeedService(ApplicationDbContext context)

        {

            _context = context;

        }
        public async Task<IEnumerable<Feed>> GetAllFeeds()

        {

            return await _context.Feeds.ToListAsync();

        }


        public async Task<Feed> GetFeedById(int feedId)

        {

            return await _context.Feeds

            .FirstOrDefaultAsync(f => f.FeedId == feedId);

        }

        public async Task<IEnumerable<Feed>> GetFeedsByUserId(int userId)

        {

            return await _context.Feeds

            .Where(f => f.UserId == userId)

            .ToListAsync();

        }

        public async Task<bool> AddFeed(Feed feed)

        {

            bool feedExists = await _context.Feeds.AnyAsync(f =>

            f.FeedName == feed.FeedName &&

            f.Type == feed.Type

            );

            if (feedExists)

            {

                throw new FeedException(

                "Feed with the same name and type already exists"

                );

            }

            await _context.Feeds.AddAsync(feed);

            await _context.SaveChangesAsync();

            return true;

        }

        public async Task<bool> UpdateFeed(int feedId, Feed feed)

        {

            var existingFeed = await _context.Feeds

            .FirstOrDefaultAsync(f => f.FeedId == feedId);

            if (existingFeed == null)

            {

                return false;

            }

            bool feedExists = await _context.Feeds.AnyAsync(f =>

            f.FeedId != feedId &&

            f.FeedName == feed.FeedName &&

            f.Type == feed.Type

            );

            if (feedExists)

            {

                throw new FeedException(

                "Feed with the same name and type already exists"

                );

            }

            existingFeed.FeedName = feed.FeedName;

            existingFeed.Type = feed.Type;

            existingFeed.Description = feed.Description;

            existingFeed.Unit = feed.Unit;

            existingFeed.Quantity = feed.Quantity;

            existingFeed.PricePerUnit = feed.PricePerUnit;

            existingFeed.UserId = feed.UserId;

            existingFeed.Image = feed.Image;

            await _context.SaveChangesAsync();

            return true;

        }

        public async Task<bool> DeleteFeed(int feedId)

        {

            var feed = await _context.Feeds

            .FirstOrDefaultAsync(f => f.FeedId == feedId);

            if (feed == null)

            {

                return false;

            }

            int requestCount = await _context.Requests

            .CountAsync(r => r.FeedId == feedId);

            if (requestCount > 0)

            {

                throw new FeedException(

                $"Feed cannot be deleted: it is referenced by {requestCount} request(s). Resolve or remove the requests first."

                );

            }

            _context.Feeds.Remove(feed);

            await _context.SaveChangesAsync();

            return true;

        }

        public async Task<int> GetRequestCountAsync(int feedId)

        {

            return await _context.Requests

            .CountAsync(r => r.FeedId == feedId);

        }

    }

}