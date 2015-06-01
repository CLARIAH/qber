import sh
import os
import argparse



def get_repository(data_path):
    git = sh.git.bake(_cwd=data_path)
    try:
        git.status('.')
    except:
        git.init('.')

    return git


def add_file(data_path, absolute_path, author, email):
    git = get_repository(data_path)

    # Get the relative path
    path = os.path.relpath(absolute_path, data_path)

    try:
        git.add(path)
        git.commit('--author=\"{} <{}>\"'.format(author, email), m="QBer commit by {} (<{}>)".format(author, email))
    except:
        pass

    sha_hash = git('ls-files', '-s', absolute_path).split(' ')[1]
    return sha_hash

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Get Git hash and commit if possible')
    parser.add_argument('data_path', type=str, help='Absolute path to GIT repository')
    parser.add_argument('path', type=str, help='Absolute path to file')
    parser.add_argument('author', type=str)
    parser.add_argument('email', type=str)

    args = parser.parse_args()

    print add_file(args.data_path, args.path, args.author, args.email)
