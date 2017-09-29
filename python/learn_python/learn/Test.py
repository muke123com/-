import keyword;
import sys;

class Test():
    def __init__(self):
        pass;
    
    def getKeywords(self):
        text = input("请输入：");
        print(text);
        k_list = keyword.kwlist;
        print(k_list);
        pass;
    
    def testSys(self):
        for i in sys.argv:
            print(i);
        print(sys.path);
        pass;
    
    def testVariable(self):
        # string
        str = "warcraft";
        print(str[3:]);
        print((str+'\n')*2);
        
        str2 = """
<HTML>
    <HEAD>
        <TITLE>Friends CGI Demo</TITLE>
    </HEAD>
    <BODY>
        <H3>ERROR</H3>
        <B>%s</B>
        <P>
            abc
        </p>
    </BODY>
</HTML>
        """
        print(str2);
        
        # list
        list = [1, 2, "aa", "cc", True];
        list[0] = "12a";
        del list[1];
#         print(list);
#         print(list[1:3]);
        list.append("object");
        print(list);
        
        # tuple 元组（tuple）与列表类似，不同之处在于元组的元素不能修改
        tuple = (1, 2, "aa", "cc", False);
        print(tuple);
        
        # set 集合（set）是一个无序不重复元素的序列。
        sets = {"123", "123", "abc", "!@#"};
        print(sets);
        print(max(sets));
        print(min(sets));
        
        a = set("abc");
        b = set("bcd");
#         print(a - b); # 差集
#         print(b - a); # 差集
#         print(a | b); # 并集
#         print(a & b); # 交集
#         print(a ^ b); # 不同时存在的元素
        
        # dictionary 字典（dictionary）是Python中另一个非常有用的内置数据类型。
        dict = {};
        dict['one'] = 'one punch';
        dict['w'] = 'zz';
        print(dict);
        for key in dict:
            print(key, end=", ");
        pass;
    
    def testIteration(self):
        list = [1,3,4,5,6,9,7,8];
        it = iter(list);
        for x in it:
            print(x);
        pass;
    
    def testFile(self):
        fo = open("ii.txt", "r+")
        print ("文件名: ", fo.name)
        
        str = "6:www.runoob.com"
        # 在文件末尾写入一行
        fo.seek(0, 2)
        line = fo.write( str )
        
        # 读取文件所有内容
        fo.seek(0,0)
        for index in range(6):
            line = next(fo)
            print ("文件行号 %d - %s" % (index, line))
        
        # 关闭文件
        fo.close()
        pass;
        
test = Test();
test.testFile();

def run():
    n = input("请输入n：");
    n = int(n);
    count = 0;
    while(count < n):
        print(getFibonacci(count), end=", ");
        count += 1;
    pass;

# 斐波纳契数列
def getFibonacci(n):
    if(n == 0 or n == 1):
        return 1
    if( n == 2): 
        return 2
    c = getFibonacci(n-1) + getFibonacci(n-2);
    return c;
    pass;

