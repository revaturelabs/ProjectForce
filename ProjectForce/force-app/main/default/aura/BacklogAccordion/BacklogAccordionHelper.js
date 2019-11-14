({
    getWeek : function (dueDate, today) {
        // https://stackoverflow.com/questions/5210376/how-to-get-first-and-last-day-of-the-week-in-javascript
        let curr = new Date(dueDate);
        var first = curr.getDate() - curr.getDay();
        let firstday = new Date(curr.setDate(first));
        let lastday = new Date(curr.setDate(curr.getDate()+6));
        
        if (firstday < today && lastday > today) return true;
        return false;
    }
})