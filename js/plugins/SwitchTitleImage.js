//=============================================================================
// SwitchTitleImage.js
// ----------------------------------------------------------------------------
// <利用規約>
//  利用はRPGツクールMV/RPGMakerMVの正規ユーザーに限られます。
//  商用、非商用、ゲームの内容を問わず利用可能です。
//  ゲームへの利用の際、報告や出典元の記載等は必須ではありません。
//  二次配布や転載は禁止します。
//  ソースコードURL、ダウンロードURLへの直接リンクも禁止します。
//  不具合対応以外のサポートやリクエストは受け付けておりません。
//  スクリプト利用により生じたいかなる問題においても、一切責任を負いかねます。
//  不具合報告は https://twitter.com/koma_neko まで。
// ----------------------------------------------------------------------------
//  Ver1.00  2016/02/29  初版
//=============================================================================

/*:
 * @plugindesc 複数のタイトル画像を切り換えて表示します。
 * @author こま
 *
 * @param Image Name
 * @desc タイトル画像名を指定してください。
 * @default Book, Castle, CrossedSwords, Crystal
 *
 * @param Display Time
 * @desc 画像表示時間を指定してください。
 * @default 60
 *
 * @param Fade Time
 * @desc 切り換え時のフェード時間を指定してください。
 * @default 0
 *
 * @param Enable Loop
 * @desc 切り換えの繰り返しの有無を指定してください。
 * @default true
 *
 * @param Random Image
 * @desc 画像をランダムで切り換えるかどうかを指定してください。
 * @default false
 *
 * @param Random Display Time
 * @desc 画像表示時間をランダムで設定するかどうかを指定してください。
 * @default false
 *
 * @param Random Fade Time
 * @desc 切り換え時のフェード時間をランダムで設定するかどうかを指定してください。
 * @default false
 *
 * @help
 * パラメータ：
 *   Image Name
 *   : タイトル画像名を指定します。表示したいタイトル画像の名前を、
 *   : カンマ区切りで指定してください。
 *   :
 *   : 指定例：Book, Castle, Crystal
 *
 *   Display Time
 *   : 1枚あたりの表示時間（フレーム数）を指定します。切り換え回数に応じて表示時
 *   : 間を変えたい場合は、カンマ区切りで複数指定してください。
 *   :
 *   : 指定例 : 60, 90, 120
 *
 *   Fade Time
 *   : 切り換え時のフェード時間（フレーム数）を指定します。0を指定すると即座に切
 *   : り換わります。切り換え回数に応じてフェード時間を変えたい場合は、カンマ区切
 *   : りで複数指定してください。なお、フェード時間は表示時間に含まれません。
 *   :
 *   : 指定例 : 10, 15, 20
 *
 *   Enable Loop
 *   : 切り換えの繰り返しを行うかどうかを指定します（true/false）。trueを指定した
 *   : 場合、設定されたタイトル画像を全て表示し終わると最初から表示します。
 *   : falseを指定した場合、最後の画像を表示した状態で切り換えを終了します。
 *
 *   Random Image
 *   Random Display Time
 *   Random Fade Time
 *   : 指定された値を、指定された順番で適用するか、ランダムで適用するかを指定しま
 *   : す（true/false）。
 
 * *このプラグインには、プラグインコマンドはありません。
 */

(function(){
    var plugin = 'SwitchTitleImage';
    
    var params = PluginManager.parameters(plugin);
    var imageName = params['Image Name'].split(/, */);
    var displayTime = params['Display Time'].split(/, */).map(function(value){ return +value; });
    var fadeTime = params['Fade Time'].split(/, */).map(function(value){ return +value; });
    var enableLoop = params['Enable Loop'].toLowerCase() === 'true';
    var randomImage = params['Random Image'].toLowerCase() === 'true';
    var randomDisplayTime = params['Random Display Time'].toLowerCase() === 'true';
    var randomFadeTime = params['Random Fade Time'].toLowerCase() === 'true';

    // Object Property for Plugin
    function pprop(obj) {
        return (obj[plugin] = obj[plugin] || {});
    }

    // Random Number
    function Random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    // Shuffle Array
    function Shuffle(array) {
        var array1 = array.slice();
        var array2 = [];
        for (var i = 0; i < array.length; i++) {
            var p = Random(0, array1.length - 1);
            array2.push(array1[p]);
            array1.splice(p, 1);
        }
        return array2;
    }
    
    //=========================================================================
    // Scene_Title
    //=========================================================================

    var _alias_Scene_Title_create = Scene_Title.prototype.create;
    Scene_Title.prototype.create = function() {
        pprop(this).imageName = (randomImage) ? Shuffle(imageName) : imageName;
        pprop(this).displayTime = (randomDisplayTime) ? Shuffle(displayTime) : displayTime;
        pprop(this).fadeTime = (randomFadeTime) ? Shuffle(fadeTime) : fadeTime;
        pprop(this).remainDisplayTime = pprop(this).displayTime[0];
        pprop(this).fadeRate = 0;
        pprop(this).displayCount = 0;
        pprop(this).lastImgae = imageName.length == 1;
        _alias_Scene_Title_create.call(this);
    };
    
    var _alias_Scene_Title_update = Scene_Title.prototype.update;
    Scene_Title.prototype.update = function() {
        if (pprop(this).fadeRate) {
            this._backSprite1.opacity -= pprop(this).fadeRate;
            if (this._backSprite1.opacity <= 0) {
                this._backSprite1.bitmap = pprop(this).backSprite0.bitmap;
                this._backSprite1.opacity = 255;
                pprop(this).fadeRate = 0;
            }
        } else if (enableLoop || !pprop(this).lastImage) {
            pprop(this).remainDisplayTime--;
            if (pprop(this).remainDisplayTime < 1) {
                var p_image = (pprop(this).displayCount + 1) % imageName.length;
                var p_dtime = (pprop(this).displayCount + 1) % displayTime.length;
                var p_ftime = pprop(this).displayCount % fadeTime.length;
                if (randomImage && p_image == 0) {
                    var _lastImage = pprop(this).imageName[imageName.length - 1];
                    do {
                        var _imageName = Shuffle(imageName);
                    } while(_imageName[0] === _lastImage);
                    pprop(this).imageName = _imageName;
                }
                if (randomDisplayTime && p_dtime == 0) {
                    pprop(this).displayTime = Shuffle(displayTime);
                }
                if (randomFadeTime && p_ftime == 0) {
                    pprop(this).fadeTime = Shuffle(fadeTime);
                }
                var _fadeTime = pprop(this).fadeTime[p_ftime];
                var _bitmap = ImageManager.loadTitle1(pprop(this).imageName[p_image]);
                if (_fadeTime) {
                    pprop(this).fadeRate = Math.floor(255 / _fadeTime);
                    pprop(this).backSprite0.bitmap = _bitmap;
                    this._backSprite1.opacity -= pprop(this).fadeRate;
                } else {
                    pprop(this).fadeRate = 0;
                    this._backSprite1.bitmap = _bitmap;
                }
                pprop(this).remainDisplayTime = pprop(this).displayTime[p_dtime];
                pprop(this).displayCount++;
                pprop(this).lastImage = (p_image == (imageName.length - 1));
            }
        }
        _alias_Scene_Title_update.call(this);
    };
    
    var _alias_Scene_Title_createBackground = Scene_Title.prototype.createBackground;
    Scene_Title.prototype.createBackground = function() {
        pprop(this).backSprite0 = new Sprite(new Bitmap());
        this.addChild(pprop(this).backSprite0);
        _alias_Scene_Title_createBackground.call(this);
        this._backSprite1.bitmap = ImageManager.loadTitle1(pprop(this).imageName[0]);
    };
}());
