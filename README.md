# How to run (check num of request dashboard test - test1) (MAC setup):
* Set username and password of your infura account in the package.json run task (line 9)

From terminal run:
* `yarn install`
* `yarn test1` (headless browser) OR `yarn test1:debug` to see the browser in debug mode

# How to run (the rate limit format check - test2):
* Install K6 on your machine `https://k6.io/docs/getting-started/installation/`
* Set `projectId` and `projectSecret` variables in `rateLimitResponseFormat.test.js (lines 10,11)` - FYI: atm this test is only focused on the daily rate limit check for the free tier account (100K req/day limit)
* Test duration is set to 5m to make sure that the test reaches the 100K daily/request limit 
* from terminal at root level run `k6 run rateLimitResponseFormat.test.js` or `yarn test2`

# TODO:
* Ideally with an unlimited account create a new test to verify rate limit in normal conditions (traffic bottleneck when req. load is too high, compared to the requests daily limit covered by prev test) 