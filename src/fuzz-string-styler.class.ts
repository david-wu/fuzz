
export class FuzzStringStyler {

  public styleWithBoldTags(targetString, matchRanges) {
    const stringStyles = matchRanges.map((range) => {
      return {
        range,
        startDecorator: '<b>',
        endDecorator: '</b>',
      };
    });
    return this.styleString(targetString, stringStyles);
  }

  public styleString(targetString: string, stringStyles: any[]): string {
    const startTagsByCharIndex: any = {};
    const endTagsByCharIndex: any = {};
    stringStyles.forEach((stringStyle) => {
      const startIndex = stringStyle.range[0];
      const endIndex = stringStyle.range[1];
      startTagsByCharIndex[startIndex] = startTagsByCharIndex[startIndex] || [];
      startTagsByCharIndex[startIndex].push(stringStyle.startDecorator);
      endTagsByCharIndex[endIndex] = endTagsByCharIndex[endIndex] || [];
      endTagsByCharIndex[endIndex].push(stringStyle.endDecorator);
    });

    const styledStringArr = [];
    for (let i = 0; i < targetString.length; i++) {
      const char = targetString[i];
      (startTagsByCharIndex[i] || []).forEach((tagToInsert: string) => {
        styledStringArr.push(tagToInsert);
      });
      styledStringArr.push(char);
      (endTagsByCharIndex[i] || []).forEach((tagToInsert: string) => {
        styledStringArr.push(tagToInsert);
      });
    }
    return styledStringArr.join('');
  }
}
