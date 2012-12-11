PwdHash-HD 2
================================================================================

Enyo 2 based application for generating pwdhash.com compatible site specific
passwords.


Author: 	Micah N Gorrell
Twitter:	@_minego
Email: 		pwdhash@minego.net
Web:		http://minego.net



Building
================================================================================

This application can simply be run in a browser, but may also be minified and
packaged for webOS. Packaging for other platforms may be included in the future.

Building requires gnu make. Minifying requires nodejs.

Deploy as debug:
	make clean all

Deploy release (minified):
	make clean release all

Package for webOS:
	make webos

Install package on a webOS device:
	make install

Test on webOS device:
	make test



PwdHash HD license:
================================================================================

You may do whatever you want with this source code with the following conditions:
 1.	You may not use reproductions, distributions, modifications, or any part of
	this source code or included images, graphics, or other media for commercial
	purposes

 2.	You may not use the "PwdHash HD" name or marks, or Micah N Gorrell, or
	minego in a manner that implies endorsement or "official" involvement.

 3.	You must retain this license notice.

Email license@minego.net if you need an exception made to the license.

Copyright 2010 - 2011 Micah N Gorrell


