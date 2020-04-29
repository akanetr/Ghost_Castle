
//=============================================================================
// Destination Sprite
// DestinationSprite.js
// Version: 1.1
//=============================================================================

//=============================================================================
 /*:
* @plugindesc v1.1 - With this plugin you can change the destination place sprite of the mouse\touch input 
* @author Krimer
* 
* @param Sprite Figure
* @desc Sprite type. It can be - Square, Circle, or Off = hide sprite. For custom image set value to - Custom. Def:Square
* @default Square
*
* @param Custom Image
* @desc Active only if "Sprite Figure" set to "Custom". Write a name of your custom image in folder '/img/system'
* @default image
*
* @param Sprite Size
* @desc Sprite Size in pixels. Ignore if "Sprite Figure" set to "Custom". Default: 48
* @default 48
* 
* @param Sprite Color
* @desc Sprite Color. Link where you can choose color is in "Help". Ignore if "Sprite Figure" set to "Custom". Default: #ffffff
* @default #ffffff
*
* @param Sprite Opacity
* @desc Set the sprite opacity. Write a number in range 0..60.   Default: 20
* @default 20
*
* @param Sprite Blend
* @desc Set the blend mode for the destination sprite.        0=NORMAL, 1=ADD
* Default: 1   
* @default 1 
*
* @help Color picker can be found here or you can use any graphic editor with hex color codes:
* http://www.w3schools.com/tags/ref_colorpicker.asp
* Recommended size for Custom Images is 48x48 or not higher than your tiles size
 */
//=============================================================================

(function() {
	var parameters = PluginManager.parameters('DestinationSprite');
	var dSpriteFigure = String(parameters['Sprite Figure'] || 'Square');
	var dSpriteColor = String(parameters['Sprite Color'] || '#ffffff');
	var dSpriteSize = Number(parameters['Sprite Size']);
	var dCustomImage = String(parameters['Custom Image']);
	var dSpriteOpacity = Number(parameters['Sprite Opacity']);
	var dSpriteBlend = Number(parameters['Sprite Blend']);
	
	Sprite_Destination.prototype.createBitmap = function() {
		var tileWidth = dSpriteSize || $gameMap.tileWidth();
		var tileHeight = dSpriteSize || $gameMap.tileHeight();
		this.bitmap = new Bitmap(tileWidth,tileHeight);
		if (dSpriteFigure == 'Square') {
			this.bitmap.fillAll(dSpriteColor);
		} else if (dSpriteFigure == 'Circle') {
			this.bitmap.drawCircle(this.bitmap.width/2,this.bitmap.height/2,dSpriteSize/2, dSpriteColor);
		} else if (dSpriteFigure == 'Off') {
		} else if (dSpriteFigure == 'Custom') {
        this.bitmap = ImageManager.loadSystem(dCustomImage)
		}
		this.anchor.x = 0.5;
		this.anchor.y = 0.5;
		this.blendMode = (dSpriteBlend == 1) ? Graphics.BLEND_ADD : Graphics.BLEND_NORMAL;
	};
	
	Sprite_Destination.prototype.updateAnimation = function() {
		this._frameCount++;
		this._frameCount %= 20;
		this.opacity = (dSpriteOpacity - this._frameCount) * 6;
		this.scale.x = 1 + this._frameCount / 20;
		this.scale.y = this.scale.x;
	};
})();
