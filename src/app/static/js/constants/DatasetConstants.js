/*
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * TodoConstants
 */

var keyMirror = require('keymirror');

module.exports = keyMirror({
  DATASET_CREATE: null,
  DATASET_COMPLETE: null,
  DATASET_DESTROY: null,
  DATASET_DESTROY_COMPLETED: null,
  DATASET_TOGGLE_COMPLETE_ALL: null,
  DATASET_UNDO_COMPLETE: null,
  DATASET_UPDATE_TEXT: null
});
