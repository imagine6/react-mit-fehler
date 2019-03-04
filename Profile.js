var startX = Math.cos(2 * Math.PI * cumulativePercent);
    var startY = Math.sin(2 * Math.PI * cumulativePercent);

    var slicePercent = value;

    cumulativePercent += slicePercent;

    var endX = Math.cos(2 * Math.PI * cumulativePercent);
    var endY = Math.sin(2 * Math.PI * cumulativePercent);

    // if the slice is more than 50%, take the large arc (the long way around)
    var largeArcFlag = slicePercent > 0.5 ? 1 : 0;

    // create an array and join it just for code readability
    var pathData = [
      `M ${startX} ${startY}`, // Move
      `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
      `L 0 0` // Line
    ].join(" ");
