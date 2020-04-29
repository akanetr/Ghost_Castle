//=============================================================================
// TMPlugin - セーブデータラベル
// バージョン: 2.0.0
// 最終更新日: 2016/08/12
// 配布元    : http://hikimoki.sakura.ne.jp/
//-----------------------------------------------------------------------------
// Copyright (c) 2016 tomoaky
// Released under the MIT license.
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc セーブファイルウィンドウに変数の値を表示します。
 *
 * @author tomoaky (http://hikimoki.sakura.ne.jp/)
 *
 * @param labelAName
 * @desc ラベルＡの名前
 * 初期値: ラベルＡ
 * @default ラベルＡ
 *
 * @param labelAId
 * @desc ラベルＡのゲーム変数番号
 * 初期値: 10（ 0 で非表示 / 1 以上で表示）
 * @default 10
 *
 * @param labelAMax
 * @desc ラベルＡの最大値
 * 初期値: 9999
 * @default 9999
 *
 * @param labelAFooter
 * @desc ラベルＡのフッターテキスト
 * 初期値: 
 * @default 
 *
 * @param labelBName
 * @desc ラベルＢの名前
 * 初期値: ラベルＢ
 * @default ラベルＢ
 *
 * @param labelBId
 * @desc ラベルＢのゲーム変数番号
 * 初期値: 0（ 0 で非表示 / 1 以上で表示）
 * @default 0
 *
 * @param labelBMax
 * @desc ラベルＢの最大値
 * 初期値: 9999
 * @default 9999
 *
 * @param labelBFooter
 * @desc ラベルＢのフッターテキスト
 * 初期値: 
 * @default 
 *
 * @param labelNameWidth
 * @desc ラベル名の表示幅
 * 初期値: 160
 * @default 160
 *
 * @param labelValueWidth
 * @desc ラベル値の表示幅
 * 初期値: 96
 * @default 96
 *
 * @param labelNameColorId
 * @desc ラベル名の文字色番号
 * 初期値: 16
 * @default 16
 *
 * @param labelValueColorId
 * @desc ラベル値の文字色番号
 * 初期値: 0
 * @default 0
 *
 * @param labelMaxColorId
 * @desc ラベル値が最大のときの文字色番号
 * 初期値: 2
 * @default 2
 *
 * @param labelFooterColorId
 * @desc フッターの文字色番号
 * 初期値: 0
 * @default 0
 *
 * @help
 * 使い方:
 *
 *   このプラグインを導入するとセーブファイルウィンドウの右上にゲーム変数の
 *   値（以下ラベル）を最大で２つまで表示することができるようになります。
 *
 *   プラグイン導入前に作成されたセーブデータは、再度セーブが実行されるまで
 *   ラベルは表示されません。
 *
 *   プラグインコマンドはありません。
 *
 *   このプラグインは RPGツクールMV Version 1.3.0 で動作確認をしています。
 *
 *
 * プラグインパラメータ補足:
 *
 *   labelAFooter / labelBFooter
 *     ラベル値の後ろに表示する文字列を設定します。
 *     『1234 点』、『12 日目』のような表示にするための機能です、値との間の
 *     スペースは半角スペースなどで調整してください。
 *
 *   labelAMax / labelBMax
 *     ゲーム変数の値がこれらの値以上だった場合、ラベルに表示される値の
 *     文字色番号が labelValueColorId から labelMaxColorId に変化します。
 *     また、ゲーム変数の値が最大値よりも大きい場合は、最大値を表示します。
 *     0 を設定すると上記機能が無効になります。
 *
 *   labelNameColorId
 *   labelValueColorId
 *   labelMaxColorId
 *   labelFooterColorId
 *     ラベルの各部分ごとの文字色番号を設定します。
 *     番号はイベントコマンド『文章の表示』などで使う制御文字 \C[n] の
 *     n の部分と同じものになります。
 */

var Imported = Imported || {};
Imported.TMSaveDataLabel = true;

var TMPlugin = TMPlugin || {};
TMPlugin.SaveDataLabel = {};
TMPlugin.SaveDataLabel.Parameters = PluginManager.parameters('TMSaveDataLabel');
TMPlugin.SaveDataLabel.LabelAName = TMPlugin.SaveDataLabel.Parameters['labelAName'];
TMPlugin.SaveDataLabel.LabelAId = +(TMPlugin.SaveDataLabel.Parameters['labelAId'] || 10);
TMPlugin.SaveDataLabel.LabelAMax = +(TMPlugin.SaveDataLabel.Parameters['labelAMax'] || 9999);
TMPlugin.SaveDataLabel.LabelAFooter = TMPlugin.SaveDataLabel.Parameters['labelAFooter'];
TMPlugin.SaveDataLabel.LabelBName = TMPlugin.SaveDataLabel.Parameters['labelBName'];
TMPlugin.SaveDataLabel.LabelBId = +(TMPlugin.SaveDataLabel.Parameters['labelBId'] || 0);
TMPlugin.SaveDataLabel.LabelBMax = +(TMPlugin.SaveDataLabel.Parameters['labelBMax'] || 9999);
TMPlugin.SaveDataLabel.LabelBFooter = TMPlugin.SaveDataLabel.Parameters['labelBFooter'];
TMPlugin.SaveDataLabel.NameWidth = +(TMPlugin.SaveDataLabel.Parameters['labelNameWidth'] || 160);
TMPlugin.SaveDataLabel.ValueWidth = +(TMPlugin.SaveDataLabel.Parameters['labelValueWidth'] || 96);
TMPlugin.SaveDataLabel.NameColorId = +(TMPlugin.SaveDataLabel.Parameters['labelNameColorId'] || 16);
TMPlugin.SaveDataLabel.ValueColorId = +(TMPlugin.SaveDataLabel.Parameters['labelValueColorId'] || 0);
TMPlugin.SaveDataLabel.MaxColorId = +(TMPlugin.SaveDataLabel.Parameters['labelMaxColorId'] || 2);
TMPlugin.SaveDataLabel.FooterColorId = +(TMPlugin.SaveDataLabel.Parameters['labelFooterColorId'] || 0);
  
(function() {

  //-----------------------------------------------------------------------------
  // DataManager
  //
  
  var _DataManager_makeSavefileInfo = DataManager.makeSavefileInfo;
  DataManager.makeSavefileInfo = function() {
    var info = _DataManager_makeSavefileInfo.call(this);
    
    if ($gameSwitches.value(73)) {
       info.title  = 'ｺﾞｰｽﾄｷｬｯｽﾙ・ｶﾞﾝｽｲｰﾊﾟｰ';
    } else {
       info.title  = 'GhostCastle GunSweeper';
    }

    info.labelA = TMPlugin.SaveDataLabel.LabelAId ? $gameVariables.value(TMPlugin.SaveDataLabel.LabelAId) : 0;
    info.labelB = TMPlugin.SaveDataLabel.LabelBId ? $gameVariables.value(TMPlugin.SaveDataLabel.LabelBId) : 0;
    return info;
  };

  //-----------------------------------------------------------------------------
  // Window_SavefileList
  //
  
  var _Window_SavefileList_drawItem = Window_SavefileList.prototype.drawItem;
  Window_SavefileList.prototype.drawItem = function(index) {
    _Window_SavefileList_drawItem.call(this, index);
    var id = index + 1;
    var valid = DataManager.isThisGameFile(id);
    var info = DataManager.loadSavefileInfo(id)
    if (info && valid) {
      var rect = this.itemRectForText(index);
      var x = rect.width + this.textPadding();

       $gameVariables.setValue(7,$gameParty.gold())
       if ($gameSwitches.value(73)) {
           $gameVariables.setValue(8,"現在地： ")
           $gameVariables.setValue(9,"所持金: ￥ ")
       } else {
           $gameVariables.setValue(8,"location: ")
           $gameVariables.setValue(9,"Money: ￥ ")
       }

       //変更　現在地名
       if ($gameMap.mapId() == 3) {
          if ($gameSwitches.value(73)) {
              $gameVariables.setValue(55,"1F エントランス")
          } else {
              $gameVariables.setValue(55,"1F Entrance")
          }
       } else if ($gameMap.mapId() == 21) {
          if ($gameSwitches.value(73)) {
              $gameVariables.setValue(55,"城外　林")
          } else {
              $gameVariables.setValue(55,"Forest Outside the castle")
          }
       } else if ($gameMap.mapId() == 22) {
          if ($gameSwitches.value(73)) {
              $gameVariables.setValue(55,"墓地")
          } else {
              $gameVariables.setValue(55,"Cemetery")
          }
       } else if ($gameMap.mapId() == 8 || ($gameMap.mapId() >= 24  && $gameMap.mapId() <= 25)) {
          if ($gameSwitches.value(73)) {
              $gameVariables.setValue(55,"地下")
          } else {
              $gameVariables.setValue(55,"Basement")
          }
       } else if ($gameMap.mapId() == 23 || $gameMap.mapId() == 44 || $gameMap.mapId() == 62) {
          if ($gameSwitches.value(73)) {
              $gameVariables.setValue(55,"隠し通路 B1")
          } else {
              $gameVariables.setValue(55,"Hidden passage B1")
          }
       } else if ($gameMap.mapId() == 43) {
          if ($gameSwitches.value(73)) {
              $gameVariables.setValue(55,"隠し通路 B2")
          } else {
              $gameVariables.setValue(55,"Hidden passage B2")
          }
       } else if ($gameMap.mapId() == 4 || $gameMap.mapId() == 6 || ($gameMap.mapId() >= 26  && $gameMap.mapId() <= 28) || ($gameMap.mapId() >= 30  && $gameMap.mapId() <= 32)) {
          if ($gameSwitches.value(73)) {
              $gameVariables.setValue(55,"城内 1F")
          } else {
              $gameVariables.setValue(55,"1F in the castle")
          }
       } else if (($gameMap.mapId() >= 10  && $gameMap.mapId() <= 12) || ($gameMap.mapId() >= 33  && $gameMap.mapId() <= 42)) {
          if ($gameSwitches.value(73)) {
              $gameVariables.setValue(55,"城内 2F")
          } else {
              $gameVariables.setValue(55,"2F in the castle")
          }
       } else if ($gameMap.mapId() == 63) {
          if ($gameSwitches.value(73)) {
              $gameVariables.setValue(55,"見張り塔 南 2F")
          } else {
              $gameVariables.setValue(55,"Watchpoint tower south 2F")
          }
       } else if ($gameMap.mapId() == 14 || ($gameMap.mapId() >= 45  && $gameMap.mapId() <= 53)) {
          if ($gameSwitches.value(73)) {
              $gameVariables.setValue(55,"城内 3F")
          } else {
              $gameVariables.setValue(55,"3F in the castle")
          }
       } else if ($gameMap.mapId() == 15) {
          if ($gameSwitches.value(73)) {
              $gameVariables.setValue(55,"見張り塔 南 3F")
          } else {
              $gameVariables.setValue(55,"Watchpoint tower south 3F")
          }
       } else if ($gameMap.mapId() == 17 || ($gameMap.mapId() >= 54  && $gameMap.mapId() <= 61)) {
          if ($gameSwitches.value(73)) {
              $gameVariables.setValue(55,"城内 4F")
          } else {
              $gameVariables.setValue(55,"4F in the castle")
          }
       } else if ($gameMap.mapId() == 18) {
          if ($gameSwitches.value(73)) {
              $gameVariables.setValue(55,"見張り塔 南 4F")
          } else {
              $gameVariables.setValue(55,"Watchpoint tower south 4F")
          }
       } else if ($gameMap.mapId() == 20) {
          if ($gameSwitches.value(73)) {
              $gameVariables.setValue(55,"見張り塔 北")
          } else {
              $gameVariables.setValue(55,"Watchpoint tower North")
          }
       }

      if (TMPlugin.SaveDataLabel.LabelAId && info.labelA != null) {
        var label = {name: $gameVariables.value(8), value: info.labelA,
                     max: TMPlugin.SaveDataLabel.LabelAMax,
                     footer: TMPlugin.SaveDataLabel.LabelAFooter};
        this.drawSaveDataLabel(x, rect.y, label);
      }

      if (TMPlugin.SaveDataLabel.LabelBId && info.labelB != null) {
        var label = {name: $gameVariables.value(9), value: info.labelB,
                     max: TMPlugin.SaveDataLabel.LabelBMax,
                     footer: TMPlugin.SaveDataLabel.LabelBFooter};
        this.drawSaveDataLabel(x, rect.y + this.lineHeight(), label);
      }
    }
  };

  Window_SavefileList.prototype.drawSaveDataLabel = function(x, y, label) {

    if (label.footer) {
      var footerWidth = this.textWidth(label.footer);
      x -= footerWidth;
      this.changeTextColor(this.textColor(TMPlugin.SaveDataLabel.FooterColorId));
      this.drawText(label.footer, x, y, footerWidth);
    }
    x -= TMPlugin.SaveDataLabel.ValueWidth;
    this.changeTextColor(this.textColor(TMPlugin.SaveDataLabel.ValueColorId));
    if (label.max && label.value >= label.max) {
      label.value = label.max;
      this.changeTextColor(this.textColor(TMPlugin.SaveDataLabel.MaxColorId));
    }
    this.drawText(label.value, x, y, TMPlugin.SaveDataLabel.ValueWidth, 'right');
    if (label.name) {
      x -= TMPlugin.SaveDataLabel.NameWidth;
      this.changeTextColor(this.textColor(TMPlugin.SaveDataLabel.NameColorId));
      this.drawText(label.name, x, y, TMPlugin.SaveDataLabel.NameWidth);
    }
  };

})();
