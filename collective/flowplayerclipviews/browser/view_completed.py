# -*- coding: utf-8 -*-

from zope.interface import alsoProvides
from Products.Five.browser import BrowserView

from collective.flowplayerclipviews.interfaces import IViewsStats, IMediaWithViewsStats

class ViewCompletedView(BrowserView):
    """View for mark the Video as view by the user"""
    
    def __init__(self, context, request):
        BrowserView.__init__(self, context, request)

    def __call__(self):
        context = self.context
        stats = IViewsStats(context)
        if not IMediaWithViewsStats.providedBy(context):
            alsoProvides(context, IMediaWithViewsStats)
            stats.views = 0
        else:
            stats.views += 1
        print stats.views
