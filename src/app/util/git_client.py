import app.config as config
import sh
import os

DATA_PATH = config.base_path



def get_repository():
    git = sh.git.bake(_cwd=DATA_PATH)

    try:
        print "Get the status"
        git.status()
    except:
        print "No status, no git repo"
        git.init()

    return git


def add_file(absolute_path, author, email):
    git = get_repository()

    # Get the relative path
    path = os.path.relpath(absolute_path,DATA_PATH)

    try:
        print "Adding {}".format(path)
        git.add(path)
        git.commit(m="QBer commit by {} (<{}>)".format(author, email))
    except Exception as e:
        print "Nothing added"

    sha_hash = git.log('--pretty=format:\'%H\'','-n',1,path)
    return str(sha_hash)




# add_file('derived/utrecht_1829_clean_01.csv', 'Rinke Hoekstra', 'rjhoekstr@gmail.com')
