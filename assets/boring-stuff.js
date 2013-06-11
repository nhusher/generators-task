(function(ns) {

    function renderUserActivity(it) {

        var o = document.getElementById('out'),
            out = '<hr />',
            types = {
                'ForkEvent': 'forked',
                'PushEvent': 'pushed to',
                'IssuesEvent': '{action} an issue on',
                'IssueCommentEvent': 'commented on an issue on',
                'CreateEvent': 'created',
                'WatchEvent': 'watched',
                'PullRequestEvent': '{action} a pull request on',
                'DeleteEvent': 'deleted {ref_type} <b>{ref}</b> in'
            };

        it.events.forEach(function(evt) {
            out += [
                '<div class="user-event">',
                sub('<img src="{avatar_url}">', evt.actor),
                sub('<a href="http://github.com/{login}">{login}</a>', evt.actor),
                types[evt.type] ? sub(types[evt.type], evt.payload) : evt.type + ' on ',
                sub('<a href="http://github.com/{name}">{name}</a>', evt.repo),
                sub('<span class="date">{date}</span>', { date: (new Date(evt.created_at)).toLocaleString()}),
                '</div>'
            ].join(' ');
        });

        o.innerHTML += out;
    }

    function mungeUserRecords(userList, userEvents) {
        var events = [],
            users = {};
  
        userList.forEach(function(user) {
          users[user.login] = user;
        });
  
        userEvents.forEach(function(evts) {
          evts.forEach(function(evt) {
            events.push(evt);
          });
        });
  
        events.sort(function(a,b) { return (new Date(b.created_at))   - (new Date(a.created_at)); });
  
        return {
          events : events,
          users  : users
        }
    }
    
    ns.renderUserActivity = renderUserActivity;
    ns.mungeUserRecords = mungeUserRecords;

}(typeof process !== 'undefined' ? exports : window));
