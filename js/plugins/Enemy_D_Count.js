//=============================================================================
//=============================================================================

/*:
 * @plugindesc 倒した敵の数をカウント。
 */

(function(){
var _Game_Action_apply = Game_Action.prototype.apply;
Game_Action.prototype.apply = function(target) {
    _Game_Action_apply.call(this, target); // 行動適用直後に
    if (this.subject().isActor() && // 行動者がアクターであり
        this.subject().actorId() === 1 && // 行動者のアクターIDが1で
        target.isEnemy() && // 対象者がエネミーであり
        target.isDead()) // 対象者が死亡している場合
    {
        // 汎用変数2番をカウントアップする
        $gameVariables.setValue(101, $gameVariables.value(101) + 1);
    }
};
}());