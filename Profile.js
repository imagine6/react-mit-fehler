var startX = Math.cos(2 * Math.PI * cumulativePercent);
    var startY = Math.sin(2 * Math.PI * cumulativePercent);

    var slicePercent = value;

    cumulativePercent += slicePercent;

    var endX = Math.cos(2 * Math.PI * cumulativePercent);
    var endY = Math.sin(2 * Math.PI * cumulativePercent);

    // if the slice is more than 50%, take the large arc (the long way around)
    var largeArcFlag = slicePercent > 0.5 ? 1 : 0;

    var err =
