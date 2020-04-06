import collections
import re

from django.contrib.staticfiles.storage import  (
    ManifestStaticFilesStorage)
from whitenoise.storage import (
    CompressedStaticFilesMixin, HelpfulExceptionMixin)


class SkipHashedFilesMixin:

    _already_hashed_pattern = re.compile(r'\.[0-9a-f]{8}\.')

    def is_already_hashed(self, path):
        """
        Determine if a file is already hashed by webpack.

        The current implementation is quite lax. Adapt as needed.

        """
        return self._already_hashed_pattern.search(path)

    def post_process(self, paths, dry_run=False, **options):
        """
        Skip files already hashed by webpack.

        """
        if dry_run:
            return

        unhashed_paths = collections.OrderedDict()
        for path, path_info in paths.items():
            if self.is_already_hashed(path):
                yield path, None, False
            else:
                unhashed_paths[path] = path_info

        yield from super().post_process(
            unhashed_paths, dry_run=dry_run, **options)

    def stored_name(self, name):
        if self.is_already_hashed(name):
            return name
        else:
            return super().stored_name(name)


class StaticFilesStorage(
        HelpfulExceptionMixin, CompressedStaticFilesMixin,
        SkipHashedFilesMixin, ManifestStaticFilesStorage):
    """
    Similar to whitenoise.storage.CompressedManifestStaticFilesStorage.

    Add a mixin to avoid hashing files that are already hashed by webpack.

    """