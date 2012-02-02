/*jslint indent: 4 */
/*global jQuery: false, jq: false, document: false, window: false, $f: false */

/**
 * JavaScript code for collective.flowplayerclipviews.
 * Controls running time of the video and warn the server when the a video are totally seen
 */

jQuery.flowplayerclipviews = {
	step_length: 5
};

jq(document).ready(function () {
	"use strict";
	var call_context = jq('base').attr('href');
	$f("*").each(function (index) {
		this.onStart(function (clip) {
			if (clip.completedCuepoints !== 1) {
				// warn server of view started
				jq.post(call_context + '/@@view-started', {}, function (data, status) {
					clip.token = data.token;
				}, 'json');
				// other settings, for cuepoints
				clip.completedCuepoints = 0;
				var fullDuration = Math.ceil(clip.fullDuration);
				var cuepoints = [];
				var i;
				for (i = jq.flowplayerclipviews.step_length; i < fullDuration; i += jq.flowplayerclipviews.step_length) {
					cuepoints.push(i * 1000);
				}
				this.onCuepoint(cuepoints, function (clip, cuepoint) {
					if (clip.completedCuepoints !== -1) {
						clip.completedCuepoints += 1;
					}
				});
			}
		}).onFinish(function (clip) {
			if (clip.completedCuepoints !== -1) {
				var fullDuration = Math.ceil(clip.fullDuration);
				var cuePointsToBeCompleted = parseInt(fullDuration / jq.flowplayerclipviews.step_length, 10) - 1;
				if (cuePointsToBeCompleted === clip.completedCuepoints) {
					jq.post(call_context + '/@@view-completed', {token: clip.token});
				}
				// seeing this video again and again will not trigger a new view count
				clip.completedCuepoints = -1;
			}
		});
	});
});