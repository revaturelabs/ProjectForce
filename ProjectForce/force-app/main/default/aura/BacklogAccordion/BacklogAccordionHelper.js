({
    getWeek : function (element) {
        // https://stackoverflow.com/questions/5210376/how-to-get-first-and-last-day-of-the-week-in-javascript
        let curr = new Date(element.DueDate__c);
        var first = curr.getDate() - curr.getDay();
        let firstday = new Date(curr.setDate(first));
        let lastday = new Date(curr.setDate(curr.getDate()+6));
        console.log(`${element.DueDate__c}`);
        console.log(`${firstday.toLocaleDateString()} - ${lastday.toLocaleDateString()}`);
    }
})