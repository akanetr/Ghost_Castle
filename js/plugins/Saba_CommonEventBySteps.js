//=============================================================================
// CommonEventBySteps.js
//=============================================================================
/*:ja
 * @author Sabakan
 * @plugindesc 指定の歩数経過後、コモンイベントを呼び出すことができるプラグインです。
 *
 * @help
 * Ver 2016-06-21 20:21:40
 *
 * ■例えばこんな時に使えます
 * ※きえさりそう
 * アイテム使用時にコモンイベントを呼び出し、キャラクターを透明にする、
 * と同時に歩数でのコモンイベントを予約します。
 * 予約したコモンイベントで、キャラクターの透明を解除します。
 *
 * トラマナ、トヘロスなども作れるかもしれません。
 *
 * プラグインコマンド
 *
 * ■予約
 * CommonEventBySteps reserve <<コモンイベントID>> <<歩数>>
 *
 * <<歩数>> 経過後、指定のコモンイベントが呼ばれます。
 * □例
 * CommonEventBySteps reserve 1 10
 * 10歩歩くとコモンイベント1が呼び出される。
 *
 *
 * ■予約の解除
 * CommonEventBySteps clear <<コモンイベントID>>
 *
 *
 * ■全ての予約の解除
 * CommonEventBySteps clearAll
 *
 *
 * @license
 * Saba_MapTachie licensed under the MIT License.
 */
var Saba;
(function (Saba) {
    var CommonEventBySteps;
    (function (CommonEventBySteps) {
        var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
        Game_Interpreter.prototype.pluginCommand = function (command, args) {
            _Game_Interpreter_pluginCommand.call(this, command, args);
            if (command !== 'CommonEventBySteps') {
                return;
            }
            var func = args[0];
            switch (func) {
                case 'reserve':
                    var commonEvId = parseInt(args[1]);
                    if (isNaN(commonEvId)) {
                        console.error('TriggeredBySteps reserve の第2引数が不正です。数値にする必要があります:' + arg[0]);
                        return;
                    }
                    var numOfSteps = parseInt(args[2]);
                    if (isNaN(numOfSteps)) {
                        console.error('TriggeredBySteps reserve の第3引数が不正です。数値にする必要があります:' + arg[1]);
                        return;
                    }
                    this.addStepTrigger(commonEvId, numOfSteps);
                    break;
                case 'clear':
                    var commonEvId = parseInt(args[1]);
                    if (isNaN(commonEvId)) {
                        console.error('TriggeredBySteps clear の第2引数が不正です。数値にする必要があります:' + arg[0]);
                        return;
                    }
                    $gameSystem.clearReservedCommonEvent(commonEvId);
                    break;
                case 'clearAll':
                    $gameSystem.clearAllReservedCommonEvents();
                    break;
                default:
                    console.error('不正な TriggeredBySteps のコマンドです: reserve, clear, clearAll のいずれかである必要があります。渡された値:' + func);
                    break;
            }
        };
        var _Game_Temp_clearCommonEvent = Game_Temp.prototype.clearCommonEvent;
        Game_Temp.prototype.clearCommonEvent = function () {
            $gameSystem.clearReservedCommonEvent(this._commonEventId);
            _Game_Temp_clearCommonEvent.call(this);
        };
        Game_System.prototype.updateStepCount = function () {
            if (!this.commonEventBySteps) {
                return;
            }
            for (var key in this.commonEventBySteps) {
                if (this.commonEventBySteps[key] > 0) {
                    this.commonEventBySteps[key]--;
                }
                if (this.commonEventBySteps[key] === 0) {
                    $gameTemp.reserveCommonEvent(key);
                }
            }
        };
        Game_System.prototype.clearReservedCommonEvent = function (commonEvId) {
            if (!this.commonEventBySteps) {
                return;
            }
            if (this.commonEventBySteps[commonEvId] !== null) {
                delete this.commonEventBySteps[commonEvId];
            }
        };
        Game_System.prototype.clearAllReservedCommonEvents = function () {
            this.commonEventBySteps = {};
        };
        Game_Interpreter.prototype.addStepTrigger = function (commonEvId, numOfSteps) {
            Game_System.prototype.commonEventBySteps = Game_System.prototype.commonEventBySteps || {};
            if (numOfSteps <= 0) {
                console.error('numOfSteps は 0 以上である必要があります');
                return;
            }
            Game_System.prototype.commonEventBySteps[commonEvId] = numOfSteps;
        };
        var _Game_Player_updateEncounterCount = Game_Player.prototype.updateEncounterCount;
        Game_Player.prototype.updateEncounterCount = function () {
            $gameSystem.updateStepCount();
            _Game_Player_updateEncounterCount.call(this);
        };
    })(CommonEventBySteps || (CommonEventBySteps = {}));
})(Saba || (Saba = {}));
