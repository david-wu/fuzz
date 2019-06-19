import { EditCosts, FuzzItem } from './models';

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

	public styleString(targetString, stringStyles) {
	  const startTagsByCharIndex = {};
	  const endTagsByCharIndex = {};
	  stringStyles.forEach((stringStyle) => {
	    const startIndex = stringStyle.range[0];
	    const endIndex = stringStyle.range[1] + 1;
	    startTagsByCharIndex[startIndex] = startTagsByCharIndex[startIndex] || [];
	    endTagsByCharIndex[endIndex] = endTagsByCharIndex[endIndex] || [];
      startTagsByCharIndex[startIndex].push(stringStyle.startDecorator);
	    endTagsByCharIndex[endIndex].push(stringStyle.endDecorator);
	  });

	  const styledStringArr = [];
	  for (let i = 0; i < targetString.length; i++) {
	    const char = targetString[i];
	    const tagsToInsert = [
	      ...(startTagsByCharIndex[i] || []),
	      ...(endTagsByCharIndex[i] || [])
	    ];
	    tagsToInsert.forEach((tagToInsert) => {
	      styledStringArr.push(tagToInsert);
	    });
	    styledStringArr.push(char);
	  }
	  return styledStringArr.join('');
	}
}
