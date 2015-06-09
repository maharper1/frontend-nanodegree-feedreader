/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function() {
    /* This is our first test suite - a test suite just contains
    * a related set of tests. This suite is all about the RSS
    * feeds definitions, the allFeeds variable in our application.
    */
    describe('RSS Feeds', function() {
        /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not
         * empty. Experiment with this before you get started on
         * the rest of this project. What happens when you change
         * allFeeds in app.js to be an empty array and refresh the
         * page?
         */
        it('are defined', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });

        /* Test that loops through each feed
         * in the allFeeds object and ensures it has a URL defined
         * and that the URL is not empty.
         * Note that an undefined element or empty string is falsy.
         */
        it('have only defined and non-empty feed URLs', function() {
            for (i  = 0; i < allFeeds.length; i++) {
                expect(allFeeds[i].url).not.toBeFalsy();
            }
        });

        /* Test that loops through each feed
         * in the allFeeds object and ensures it has a name defined
         * and that the name is not empty.
         * Note that an undefined element or empty string is falsy.
         */
        it('have only defined and non-empty feed names', function() {
            for (i  = 0; i < allFeeds.length; i++) {
                expect(allFeeds[i].name).not.toBeFalsy();
            }
        });

        /* Test to see if more than one feed option exists.
         * If not, then the New Feed Selection test will fail.
         */
        it('contains more than one feed', function() {
            expect(allFeeds.length).toBeGreaterThan(1);
        });
    });


    /* Test suite for "The menu" */
    describe('The menu', function() {
        /* Test that ensures the menu element is
         * hidden by default. The menu element is hidden by adding the
         * "menu-hidden" class to the body element.
         */
        // Create variables for the menu element and the menu button element.
        var menu = document.getElementsByClassName('menu')[0];
        var menuBtn = document.getElementsByClassName('menu-icon-link')[0];

        // function to check if the right side of the menu has a positive position value,
        // ie. it is visible.
        function menuVisible() {
            // getBoundingClientRect gets the current (transformed) bounds coordinates.
            var rect = menu.getBoundingClientRect();
            // If the right value is 0, the menu is pushed out of the viewport.
            if (rect.right > 0) {
                return true;
            } else {
                return false;
            }
        }

        it('is initially hidden', function() {
            // Checking by class (seems insufficient, since what if the class doesn't work?)
            expect(document.body.classList).toContain('menu-hidden');
            // Checking by viewport location
            expect(menuVisible()).toBe(false);
        });

         /* Test that ensures the menu changes
          * visibility when the menu icon is clicked. This test
          * has two expectations: does the menu display when
          * clicked and does it hide when clicked again.
          */
        it('appears and disappears when the menu icon is clicked', function() {
            /* Temporarily set transition time to 0, otherwise you would have
             * to wait until the transition is complete to check the new position
             * of the menu. This is not needed for the class content check, just for
             * the menuVisible checking. Could be switched to an async check on transitionend, maybe.
             */
            menu.style.transition = "transform 0.0s";
            // Click the menu button.
            menuBtn.click();
            // Check if 'menu-hidden' has been removed.
            expect(document.body.classList).not.toContain('menu-hidden');
            // Check if the menu is visible by looking at it's position.
            expect(menuVisible()).toBe(true);
            // Click the menu button a second time.
            menuBtn.click();
            // Check if 'menu-hidden' has been added back.
            expect(document.body.classList).toContain('menu-hidden');
            // Check if the menu is visible by looking at it's position.
            expect(menuVisible()).toBe(false);
            // Add back the transition time.
            menu.style.transition = "transform 0.2s";
        });
    });


    /* Test suite named "Initial Entries" */
    describe('Intial Entries', function() {
        /* Test that ensures when the loadFeed
         * function is called and completes its work, there is at least
         * a single .entry element within the .feed container.
         * The function loadFeed() is asynchronous so this test requires
         * the use of Jasmine's beforeEach and asynchronous done() function.
         */

        // Load the first feed option and set done in the callback function.
        beforeEach(function(done) {
            loadFeed(0, function() {
                done();
            });
        });

        // When the beforeEach action is done, check that at least one entry exists.
        it('should load a feed', function(done) {
            var feedContainer = document.getElementsByClassName('feed')[0];
            var entries = feedContainer.getElementsByClassName('entry');
            expect(entries.length).toBeGreaterThan(0);
            done();
        });
    });

    /* Test suite named "New Feed Selection" */
    describe('New Feed Selection', function() {
        /* Test that ensures when a new feed is loaded
         * by the loadFeed function that the content actually changes.
         * Remember, loadFeed() is asynchronous.
         */

        // Create variables to hold the feed container element and
        //  the first entry returned by each feed load.
        var feedContainer = document.getElementsByClassName('feed')[0];
        var firstEntry0;
        var firstEntry1;

        /* Call loadFeed with the first feed. Then in the callback function, call
         * loadFeed again, but with the second feed, capturing the first entry
         * for both feeds.
         */
        beforeEach(function(done) {
            loadFeed(0, function() {
                firstEntry0 = feedContainer.getElementsByClassName('entry')[0].innerText;
                loadFeed(1, function() {
                    firstEntry1 = feedContainer.getElementsByClassName('entry')[0].innerText;
                    done();
                });
            });
        });

        // When the test is complete, set the current feed back to the first feed.
        afterEach(function() {
            // Reset to the first feed.
            loadFeed(0);
        });

        // Check that the first entry from the feeds is different.
        it('should load different content', function(done) {
            expect(firstEntry0).not.toEqual(firstEntry1);
            done();
        });
    });
}());