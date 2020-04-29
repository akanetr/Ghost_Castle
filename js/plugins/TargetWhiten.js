/*:
 * @plugindesc Displays select enemy whiten.
 * @author Lib
 *
 * @param Unknown Data
 * @desc 
 * @default ??????
 *
 * @help
 *
 * Plugin Command:
 *
 * Enemy Note:
 */

//選択時の点滅が白点滅になって派手になります。
//ただそれだけです。
//作:Lib

(function() {

Sprite_Battler.prototype.updateSelectionEffect = function() {
    var target = this._effectTarget;
    if (this._battler.isSelected()) {
        this._selectionEffectCount += 6;
	this._selectionEffectCount %= 180;
	col = 255 * Math.sin((-90+this._selectionEffectCount/180)*Math.PI);
        target.setBlendColor([col, col, col, col]);
    } else if (this._selectionEffectCount > 0) {
        this._selectionEffectCount = 0;
        target.setBlendColor([0, 0, 0, 0]);
    };
};

})();
