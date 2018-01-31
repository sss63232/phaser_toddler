// -- user code here --

/* --- start generated code --- */

// Generated by  1.4.4 (Phaser v2.6.2)


class MuteBtn extends Phaser.Sprite {
	/**
	 * MuteBtn
	 * @param {Phaser.Game} aGame A reference to the currently running game.
	 * @param {Number} aX The x coordinate (in world space) to position the Sprite at.
	 * @param {Number} aY The y coordinate (in world space) to position the Sprite at.
	 * @param {any} aKey This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
	 * @param {any} aFrame If this Sprite is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
	 */
	constructor(aGame, aX, aY, aKey, aFrame) {
		super(aGame, aX, aY, aKey || 'audio', aFrame  == undefined || aFrame == null? 'audio0.png' : aFrame);
		var _anim_audio = this.animations.add('audio', ['audio0.png'], 60, false);
		var _anim_mute = this.animations.add('mute', ['audio1.png'], 60, false);
		
		// public fields
		
		this.fMuteBtn = this;
		this.fAnim_audio = _anim_audio;
		this.fAnim_mute = _anim_mute;
		
	}
	
	/* sprite-methods-begin */
	// -- user code here --
	/* sprite-methods-end */
}
/* --- end generated code --- */
// -- user code here --
export default MuteBtn;